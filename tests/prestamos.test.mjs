import { test } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { crearApp } from "../dist/src/composition/app.js";
import { MemoriaPrestamos } from "../dist/src/modules/prestamos/infrastructure/memoria.js";

async function entorno(t) {
  const server = crearApp().listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve) => server.close(resolve)));
  return async (path = "/api/v1/prestamos", body, raw = false) => {
    const r = await fetch(
      `http://127.0.0.1:${server.address().port}${path}`,
      body === undefined
        ? {}
        : {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: raw ? body : JSON.stringify(body),
          },
    );
    return { status: r.status, body: await r.json() };
  };
}
const entrada = { ejemplarId: "LIB-001", lector: "Lector ficticio A" };

test("RF01/RF02: alta, consulta, devolución, historial y nuevo préstamo", async (t) => {
  const api = await entorno(t);
  assert.deepEqual((await api()).body.items, []);
  const alta = await api("/api/v1/prestamos", {
    ...entrada,
    lector: "  Lector ficticio A  ",
  });
  assert.equal(alta.status, 201);
  assert.equal(alta.body.lector, entrada.lector);
  assert.equal(alta.body.estado, "ACTIVO");
  assert.match(alta.body.id, /^[a-f0-9-]{36}$/);
  assert.deepEqual(
    (await api(`/api/v1/prestamos/${alta.body.id}`)).body,
    alta.body,
  );
  const devolver = await api(
    `/api/v1/prestamos/${alta.body.id}/devolucion`,
    {},
  );
  assert.equal(devolver.status, 200);
  assert.equal(devolver.body.estado, "DEVUELTO");
  assert.equal(
    (await api(`/api/v1/prestamos/${alta.body.id}/devolucion`, {})).status,
    409,
  );
  assert.equal((await api("/api/v1/prestamos", entrada)).status, 201);
  assert.equal((await api()).body.items.length, 2);
});
test("RN01: segundo préstamo activo del mismo ejemplar se rechaza sin escribir", async (t) => {
  const api = await entorno(t);
  assert.equal((await api("/api/v1/prestamos", entrada)).status, 201);
  const duplicado = await api("/api/v1/prestamos", entrada);
  assert.deepEqual(duplicado, {
    status: 409,
    body: { codigo: "OCUPADO", mensaje: "OCUPADO", detalles: [] },
  });
  assert.equal((await api()).body.items.length, 1);
  assert.equal(
    (await api("/api/v1/prestamos", { ...entrada, ejemplarId: "LIB-002" }))
      .status,
    201,
  );
});
test("RN01: dos peticiones concurrentes tienen un solo ganador", async (t) => {
  const api = await entorno(t);
  const resultados = await Promise.all([
    api("/api/v1/prestamos", entrada),
    api("/api/v1/prestamos", entrada),
  ]);
  assert.deepEqual(resultados.map((r) => r.status).sort(), [201, 409]);
  assert.equal((await api()).body.items.length, 1);
});
test("RN02: ejemplar, préstamo y devolución inexistentes devuelven 404", async (t) => {
  const api = await entorno(t);
  assert.equal(
    (await api("/api/v1/prestamos", { ...entrada, ejemplarId: "LIB-999" }))
      .status,
    404,
  );
  assert.equal((await api("/api/v1/prestamos/ausente")).status, 404);
  assert.equal(
    (await api("/api/v1/prestamos/ausente/devolucion", {})).status,
    404,
  );
  assert.deepEqual((await api()).body.items, []);
});
const invalidos = [
  null,
  [],
  "texto",
  {},
  { ...entrada, lector: 7 },
  { ...entrada, lector: " " },
  { ...entrada, lector: "x".repeat(61) },
  { ...entrada, ejemplarId: 3 },
  { ...entrada, ejemplarId: "otro" },
  { ...entrada, estado: "DEVUELTO" },
];
for (const [i, dato] of invalidos.entries()) {
  test(`RN03: entrada inválida ${i + 1} rechazada con 400 sin escritura`, async (t) => {
    const api = await entorno(t);
    assert.deepEqual(await api("/api/v1/prestamos", dato), {
      status: 400,
      body: { codigo: "INVALIDO", mensaje: "INVALIDO", detalles: [] },
    });
    assert.deepEqual((await api()).body.items, []);
  });
}
test("RN03: fronteras de longitud aceptadas", async (t) => {
  const api = await entorno(t);
  assert.equal(
    (await api("/api/v1/prestamos", { ...entrada, lector: "AB" })).status,
    201,
  );
  assert.equal(
    (
      await api("/api/v1/prestamos", {
        ...entrada,
        ejemplarId: "LIB-002",
        lector: "x".repeat(60),
      })
    ).status,
    201,
  );
});
test("HTTP: JSON roto, cuerpo excesivo y ruta desconocida", async (t) => {
  const api = await entorno(t);
  assert.equal((await api("/api/v1/prestamos", "{", true)).status, 400);
  assert.equal(
    (await api("/api/v1/prestamos", { ...entrada, lector: "x".repeat(3000) }))
      .status,
    413,
  );
  assert.equal((await api("/desconocida")).status, 404);
});
test("Adaptador: las copias no permiten cambiar el estado almacenado", () => {
  const repo = new MemoriaPrestamos();
  const p = { id: "ficticio", ...entrada, estado: "ACTIVO" };
  repo.guardar(p);
  p.estado = "DEVUELTO";
  repo.buscar("ficticio").estado = "DEVUELTO";
  repo.listar()[0].estado = "DEVUELTO";
  assert.equal(repo.buscar("ficticio").estado, "ACTIVO");
});

test("HTTP: paginación acotada y errores uniformes", async (t) => {
  const api = await entorno(t);
  await api("/api/v1/prestamos", entrada);
  await api("/api/v1/prestamos", { ...entrada, ejemplarId: "LIB-002" });
  const pagina = await api("/api/v1/prestamos?pagina=2&tamano=1");
  assert.equal(pagina.body.items.length, 1);
  assert.equal(pagina.body.items[0].ejemplarId, "LIB-002");
  assert.equal(pagina.body.total, 2);
  assert.equal(pagina.body.pagina, 2);
  assert.equal(pagina.body.tamano, 1);
  for (const query of [
    "pagina=0",
    "pagina=1000001",
    "pagina=1.2",
    "pagina=x",
    "tamano=0",
    "tamano=101",
    "tamano=x",
  ]) {
    const error = await api(`/api/v1/prestamos?${query}`);
    assert.equal(error.status, 400);
    assert.deepEqual(Object.keys(error.body).sort(), [
      "codigo",
      "detalles",
      "mensaje",
    ]);
  }
});

import { spawn } from "node:child_process";
import { once } from "node:events";
import { writeFileSync, mkdirSync } from "node:fs";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
process.chdir(fileURLToPath(new URL("../", import.meta.url)));
const servidor = spawn(process.execPath, ["dist/src/composition/server.js"], {
  stdio: ["ignore", "pipe", "pipe"],
});
const salida = [];
servidor.stderr.on("data", (dato) => salida.push(dato.toString()));
const fin = once(servidor, "exit");
const comprobaciones = [];
let timer;
try {
  const url = await new Promise((resolve, reject) => {
    timer = setTimeout(
      () => reject(new Error("El servidor no anunció URL")),
      10000,
    );
    servidor.stdout.on("data", (dato) => {
      const texto = dato.toString();
      salida.push(texto);
      const match = texto.match(
        /http:\/\/127\.0\.0\.1:\d+\/api\/v1\/prestamos/,
      );
      if (match) resolve(match[0]);
    });
    servidor.on("error", reject);
  });
  clearTimeout(timer);
  const listado = await fetch(url);
  assert.equal(listado.status, 200);
  assert.deepEqual(await listado.json(), {
    items: [],
    pagina: 1,
    tamano: 20,
    total: 0,
  });
  comprobaciones.push("GET real al proceso compilado: 200 y lista vacía");
  const alta = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      ejemplarId: "LIB-001",
      lector: "Lector ficticio smoke",
    }),
  });
  assert.equal(alta.status, 201);
  const prestamo = await alta.json();
  assert.equal(prestamo.estado, "ACTIVO");
  comprobaciones.push("POST real al entrypoint: 201 y préstamo ACTIVO");
} finally {
  clearTimeout(timer);
  servidor.kill("SIGTERM");
  const [codigo, signal] = await fin;
  mkdirSync("evidencias", { recursive: true });
  writeFileSync(
    "evidencias/smoke.json",
    JSON.stringify(
      {
        fechaUTC: new Date().toISOString(),
        comprobaciones,
        procesoTerminado: true,
        codigo,
        signal,
        salida,
      },
      null,
      2,
    ) + "\n",
  );
}
console.log("Smoke del proceso compilado aprobado; proceso detenido.");

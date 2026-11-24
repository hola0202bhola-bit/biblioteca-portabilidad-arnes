import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(root);
mkdirSync("evidencias", { recursive: true });
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
function fuentes(dir = "src") {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? fuentes(`${dir}/${e.name}`) : [`${dir}/${e.name}`],
  );
}
const originales = new Map(fuentes().map((p) => [p, readFileSync(p)]));
const resultados = [];
function ejecutar(nombre, esperado, detalle) {
  const inicio = new Date();
  const r = spawnSync(process.execPath, ["scripts/check.mjs"], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (r.error) throw r.error;
  writeFileSync(`evidencias/${nombre}.log`, r.stdout + r.stderr);
  const entrada = {
    nombre,
    esperado,
    salida: r.status,
    coincide: esperado === r.status,
    inicio: inicio.toISOString(),
    duracionMs: Date.now() - inicio.getTime(),
    detalle,
  };
  resultados.push(entrada);
  console.log(
    `${nombre}: salida ${r.status}, esperada ${esperado}, ${entrada.duracionMs} ms`,
  );
  if (!entrada.coincide)
    throw new Error(
      `Resultado inesperado en ${nombre}; consultar log íntegro.`,
    );
  return r.stdout + r.stderr;
}
let fallo;
try {
  ejecutar("01-aceptacion", 0, "Proyecto completo conforme a las reglas.");
  const dominio = "src/modules/prestamos/domain/prestamo.ts";
  writeFileSync(
    dominio,
    'import "../infrastructure/memoria.js";\n' +
      originales.get(dominio).toString(),
  );
  const arquitectura = ejecutar(
    "02-rechazo-arquitectura",
    1,
    "Importación prohibida domain -> infrastructure; verificar dominio-puro.",
  );
  if (!arquitectura.includes("dominio-puro"))
    throw new Error("Faltó la infracción esperada.");
  writeFileSync(dominio, originales.get(dominio));
  const servicio = "src/modules/prestamos/application/servicio.ts";
  const texto = originales.get(servicio).toString();
  const alterado = texto.replace(
    'p.estado === "ACTIVO"',
    'p.estado === "DEVUELTO"',
  );
  if (texto === alterado)
    throw new Error("No se pudo construir el cambio de regla.");
  writeFileSync(servicio, alterado);
  const prettier = spawnSync(
    process.execPath,
    [
      "vendor/arnes/node_modules/prettier/bin/prettier.cjs",
      "--write",
      servicio,
    ],
    { encoding: "utf8" },
  );
  if (prettier.status !== 0)
    throw new Error("No se pudo normalizar el formato del cambio.");
  const negocio = ejecutar(
    "03-rechazo-negocio",
    1,
    "RN01 alterada: se consideran ocupados los devueltos en lugar de los activos. Deben fallar pruebas HTTP de duplicado/concurrencia y ciclo.",
  );
  if (!negocio.includes("not ok") || !negocio.includes("RN01"))
    throw new Error("El rechazo no provino de las pruebas previstas.");
} catch (error) {
  fallo = error;
} finally {
  for (const [ruta, bytes] of originales) writeFileSync(ruta, bytes);
}
const restaurados = [...originales].every(
  ([p, bytes]) => hash(readFileSync(p)) === hash(bytes),
);
if (!fallo)
  ejecutar(
    "04-aceptacion-restaurada",
    0,
    "Restauración byte por byte; vuelve a aceptar el proyecto.",
  );
writeFileSync(
  "evidencias/resultados.json",
  JSON.stringify(
    {
      fechaUTC: new Date().toISOString(),
      sintetico: true,
      alcance:
        "API de biblioteca independiente, datos ficticios; no es gate de Ecclesia ni video",
      node: process.version,
      plataforma: process.platform,
      arnes: "473533a7b9e4e479e8c76d2835a6e2cecb9d662e",
      resultados,
      restaurados,
      fuentes: [...originales].map(([ruta, bytes]) => ({
        ruta,
        sha256: hash(bytes),
      })),
      fallo: fallo ? String(fallo) : null,
    },
    null,
    2,
  ) + "\n",
);
if (!restaurados) throw new Error("Restauración incompleta.");
if (fallo) throw fallo;
console.log(
  "Demostración completada; fuentes originales conservadas. No se grabó video.",
);

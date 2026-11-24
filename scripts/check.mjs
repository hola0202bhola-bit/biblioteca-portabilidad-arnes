import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkArchitecture } from "../vendor/arnes/scripts/check-architecture.mjs";
import { validateContract } from "../vendor/arnes/scripts/validate-contract.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(root);
const run = (file, args) => {
  const result = spawnSync(process.execPath, [resolve(file), ...args], {
    stdio: "inherit",
    cwd: root,
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(`Comprobación fallida: ${file} (salida ${result.status})`);
};
const inventario = JSON.parse(
  readFileSync("docs/arnes-procedencia.json", "utf8"),
);
for (const archivo of inventario.archivos) {
  const hash = createHash("sha256")
    .update(readFileSync(`vendor/arnes/${archivo.ruta}`))
    .digest("hex");
  if (hash !== archivo.sha256)
    throw new Error(`Arnés modificado: ${archivo.ruta}`);
}
console.log(
  `Arnés íntegro: ${inventario.archivos.length} archivos de ${inventario.commit}`,
);
console.log("Arquitectura real:", checkArchitecture(root));
await validateContract(resolve("openapi.json"));
console.log("OpenAPI válido; la ejecución HTTP se comprueba después.");
run("vendor/arnes/node_modules/eslint/bin/eslint.js", [
  "--config",
  "eslint.config.mjs",
  "src",
  "scripts",
  "tests",
]);
run("vendor/arnes/node_modules/prettier/bin/prettier.cjs", [
  "--check",
  "src",
  "scripts",
  "tests",
  "docs",
  "*.md",
  "*.json",
]);
run("node_modules/typescript/bin/tsc", ["-p", "tsconfig.json"]);
const pruebas = spawnSync(process.execPath, ["--run", "test"], {
  stdio: "inherit",
  cwd: root,
});
if (pruebas.error) throw pruebas.error;
if (pruebas.status !== 0)
  throw new Error(`Pruebas/cobertura rechazadas (salida ${pruebas.status})`);
console.log(
  "ACEPTADO: integridad, arquitectura, contrato, lint de herramientas, formato, TypeScript y pruebas HTTP/cobertura.",
);

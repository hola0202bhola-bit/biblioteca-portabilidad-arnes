import { spawnSync } from "node:child_process";
function git(args) {
  const r = spawnSync("git", args, { encoding: "utf8" });
  if (r.status !== 0)
    throw new Error(
      `Git rechazó ${args.join(" ")}; hay cambios fuera del índice o un error de lectura.`,
    );
  return r.stdout;
}
function verificar() {
  git(["diff", "--quiet"]);
  if (git(["ls-files", "--others", "--exclude-standard"]).trim())
    throw new Error("Añadir o retirar archivos nuevos antes del commit.");
}
verificar();
const indice = git(["write-tree"]).trim();
const r = spawnSync(process.execPath, ["scripts/check.mjs"], {
  stdio: "inherit",
});
if (r.error) throw r.error;
if (r.status !== 0)
  throw new Error(
    "Commit rechazado por las comprobaciones reales de biblioteca.",
  );
verificar();
if (git(["write-tree"]).trim() !== indice)
  throw new Error("El índice cambió durante la comprobación.");
console.log(
  "Pre-commit biblioteca aceptado; índice estable y sin cambios fuera del índice.",
);

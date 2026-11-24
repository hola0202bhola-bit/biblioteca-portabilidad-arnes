import { crearApp } from "./app.js";
const servidor = crearApp().listen(0, "127.0.0.1", () => {
  const direccion = servidor.address();
  if (direccion && typeof direccion === "object")
    console.log(
      `API ficticia: http://127.0.0.1:${direccion.port}/api/v1/prestamos`,
    );
});
process.on("SIGINT", () => servidor.close());
process.on("SIGTERM", () => servidor.close());

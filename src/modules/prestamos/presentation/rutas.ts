import { Router } from "express";
import { ErrorPrestamo } from "../domain/prestamo.js";
import type { ServicioPrestamos } from "../application/servicio.js";

export function rutasPrestamos(servicio: ServicioPrestamos): Router {
  const router = Router();
  router.get("/", (req, res) => {
    const pagina = Number(req.query.pagina ?? "1");
    const tamano = Number(req.query.tamano ?? "20");
    if (
      !Number.isSafeInteger(pagina) ||
      pagina < 1 ||
      pagina > 1000000 ||
      !Number.isSafeInteger(tamano) ||
      tamano < 1 ||
      tamano > 100
    ) {
      throw new ErrorPrestamo("INVALIDO");
    }
    const todos = servicio.listar();
    res.json({
      items: todos.slice((pagina - 1) * tamano, pagina * tamano),
      pagina,
      tamano,
      total: todos.length,
    });
  });
  router.post("/", (req, res) => {
    res.status(201).json(servicio.crear(req.body));
  });
  router.get("/:id", (req, res) => {
    res.json(servicio.consultar(req.params.id));
  });
  router.post("/:id/devolucion", (req, res) => {
    res.json(servicio.devolver(req.params.id));
  });
  return router;
}

export function estadoError(error: ErrorPrestamo): number {
  if (error.codigo === "INVALIDO") return 400;
  if (error.codigo === "NO_EXISTE") return 404;
  return 409;
}

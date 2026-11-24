import express, { type ErrorRequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { ServicioPrestamos } from "../modules/prestamos/application/servicio.js";
import { MemoriaPrestamos } from "../modules/prestamos/infrastructure/memoria.js";
import {
  rutasPrestamos,
  estadoError,
} from "../modules/prestamos/presentation/rutas.js";
import { ErrorPrestamo } from "../modules/prestamos/domain/prestamo.js";

export function crearApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "2kb", strict: false }));
  app.use(
    "/api/v1/prestamos",
    rutasPrestamos(new ServicioPrestamos(new MemoriaPrestamos(), randomUUID)),
  );
  app.use((_req, res) => {
    res.status(404).json({
      codigo: "RUTA_NO_EXISTE",
      mensaje: "Ruta no encontrada",
      detalles: [],
    });
  });
  const errores: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
    if (error instanceof ErrorPrestamo) {
      res
        .status(estadoError(error))
        .json({ codigo: error.codigo, mensaje: error.codigo, detalles: [] });
    } else if (error instanceof SyntaxError) {
      res.status(400).json({
        codigo: "JSON_INVALIDO",
        mensaje: "JSON_INVALIDO",
        detalles: [],
      });
    } else if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      error.status === 413
    ) {
      res.status(413).json({
        codigo: "CUERPO_EXCESIVO",
        mensaje: "CUERPO_EXCESIVO",
        detalles: [],
      });
    } else {
      res
        .status(500)
        .json({ codigo: "INTERNO", mensaje: "INTERNO", detalles: [] });
    }
  };
  app.use(errores);
  return app;
}

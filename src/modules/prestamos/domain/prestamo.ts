export type Prestamo = {
  id: string;
  ejemplarId: string;
  lector: string;
  estado: "ACTIVO" | "DEVUELTO";
};

export class ErrorPrestamo extends Error {
  constructor(
    public readonly codigo: "INVALIDO" | "NO_EXISTE" | "OCUPADO" | "DEVUELTO",
  ) {
    super(codigo);
  }
}

export interface RepositorioPrestamos {
  existeEjemplar(id: string): boolean;
  buscar(id: string): Prestamo | undefined;
  listar(): Prestamo[];
  guardar(prestamo: Prestamo): void;
}

export function crearPrestamo(id: string, entrada: unknown): Prestamo {
  if (!entrada || typeof entrada !== "object" || Array.isArray(entrada)) {
    throw new ErrorPrestamo("INVALIDO");
  }
  const dato = entrada as Record<string, unknown>;
  if (
    Object.keys(dato).some(
      (clave) => !["ejemplarId", "lector"].includes(clave),
    ) ||
    typeof dato.ejemplarId !== "string" ||
    !/^LIB-\d{3}$/.test(dato.ejemplarId) ||
    typeof dato.lector !== "string" ||
    dato.lector.trim().length < 2 ||
    dato.lector.trim().length > 60
  ) {
    throw new ErrorPrestamo("INVALIDO");
  }
  return {
    id,
    ejemplarId: dato.ejemplarId,
    lector: dato.lector.trim(),
    estado: "ACTIVO",
  };
}

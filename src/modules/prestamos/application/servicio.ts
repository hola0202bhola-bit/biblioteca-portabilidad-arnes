import {
  crearPrestamo,
  ErrorPrestamo,
  type RepositorioPrestamos,
  type Prestamo,
} from "../domain/prestamo.js";

export class ServicioPrestamos {
  constructor(
    private readonly repositorio: RepositorioPrestamos,
    private readonly nuevoId: () => string,
  ) {}

  crear(entrada: unknown): Prestamo {
    const prestamo = crearPrestamo(this.nuevoId(), entrada);
    if (!this.repositorio.existeEjemplar(prestamo.ejemplarId))
      throw new ErrorPrestamo("NO_EXISTE");
    if (
      this.repositorio
        .listar()
        .some(
          (p) => p.ejemplarId === prestamo.ejemplarId && p.estado === "ACTIVO",
        )
    ) {
      throw new ErrorPrestamo("OCUPADO");
    }
    this.repositorio.guardar(prestamo);
    return prestamo;
  }

  listar(): Prestamo[] {
    return this.repositorio.listar();
  }

  consultar(id: string): Prestamo {
    const prestamo = this.repositorio.buscar(id);
    if (!prestamo) throw new ErrorPrestamo("NO_EXISTE");
    return prestamo;
  }

  devolver(id: string): Prestamo {
    const prestamo = this.consultar(id);
    if (prestamo.estado === "DEVUELTO") throw new ErrorPrestamo("DEVUELTO");
    const devuelto: Prestamo = { ...prestamo, estado: "DEVUELTO" };
    this.repositorio.guardar(devuelto);
    return devuelto;
  }
}

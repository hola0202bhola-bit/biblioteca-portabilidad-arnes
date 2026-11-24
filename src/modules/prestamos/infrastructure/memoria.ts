import type { Prestamo, RepositorioPrestamos } from "../domain/prestamo.js";

export class MemoriaPrestamos implements RepositorioPrestamos {
  private readonly datos = new Map<string, Prestamo>();
  existeEjemplar(id: string): boolean {
    return ["LIB-001", "LIB-002"].includes(id);
  }
  buscar(id: string): Prestamo | undefined {
    const p = this.datos.get(id);
    return p ? { ...p } : undefined;
  }
  listar(): Prestamo[] {
    return [...this.datos.values()].map((p) => ({ ...p }));
  }
  guardar(p: Prestamo): void {
    this.datos.set(p.id, { ...p });
  }
}

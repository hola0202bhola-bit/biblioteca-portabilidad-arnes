# Requisitos del ejemplo

Origen: alcance técnico definido para ejecutar P198 (API de préstamo de libros), no requisitos atribuidos a un cliente real. Datos y escenarios sintéticos propios del proyecto de portabilidad.

| ID   | Regla y aceptación verificable                                                                                                                                                                   | Evidencia                                                           |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| RF01 | POST /api/v1/prestamos crea con UUID, ejemplarId LIB-001 o LIB-002, lector ficticio y estado ACTIVO; devuelve 201. GET /api/v1/prestamos lista y GET /api/v1/prestamos/{id} consulta, 200.       | pruebas de ciclo y consulta                                         |
| RF02 | POST /api/v1/prestamos/{id}/devolucion cambia ACTIVO a DEVUELTO, 200. Segunda devolución, 409. No se elimina la historia.                                                                        | prueba de ciclo                                                     |
| RN01 | Máximo un préstamo ACTIVO por ejemplar. Duplicado 409 OCUPADO y sin escritura; otro ejemplar permitido; tras devolución se permite otro préstamo. Dos peticiones simultáneas producen 201 y 409. | duplicado, concurrencia y ciclo; mutación rechazada                 |
| RN02 | Ejemplar o préstamo inexistente: 404 NO_EXISTE. No se crean registros.                                                                                                                           | pruebas de inexistentes                                             |
| RN03 | Objeto JSON con solo ejemplarId (LIB y tres dígitos) y lector de 2 a 60 caracteres tras trim. Tipo/campos extra/formato/longitud inválidos: 400. JSON roto: 400. Cuerpo >2 KB: 413.              | entradas inválidas, fronteras y HTTP                                |
| AR01 | Dominio puro, aplicación sin infraestructura/HTTP, presentación sin infraestructura, infraestructura sin aplicación/HTTP; composición inyecta dependencias.                                      | verificador original sin cambios y rechazo domain -> infrastructure |

La unicidad es síncrona en un solo proceso Node con repositorio en memoria; no demuestra transacciones SQL ni seguridad de varias instancias. API educativa local sin autenticación; no apta para datos reales o despliegue público. Fuente en español, variables propias de biblioteca.

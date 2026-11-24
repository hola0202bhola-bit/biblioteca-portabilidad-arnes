# Biblioteca: portabilidad del arnés Ecclesia

Ejemplo académico independiente de Ecclesia: un módulo completo de préstamos y devoluciones, generado con Codex y dirigido por el núcleo publicado del arnés. Solo datos ficticios y memoria efímera; no usar con datos reales ni exponer a Internet.

## Fuente, versión y alcance

- Requisito exacto: P198 y P237, documentados en [fuente](docs/fuentes-requisito.md).
- Arnés remoto main verificado en `473533a7b9e4e479e8c76d2835a6e2cecb9d662e`.
- [PROYECTO.md](PROYECTO.md), [requisitos](docs/requisitos.md), [arquitectura](docs/ARCHITECTURE.md), [ADR](docs/adr/001.md) y [OpenAPI](openapi.json).
- [Nota de portabilidad](docs/Nota_portabilidad.md), [guion de grabación](docs/Guion_video.md), [bitácora](docs/bitacora-ia.md) y [resultados reales](evidencias/resultados.json).

Se incorporan 16 archivos originales con huellas verificadas, como una selección explícita del arnés publicado. No se presenta esta selección como el traslado íntegro del pipeline Ecclesia. Su repositorio original sigue separado y sin modificaciones. La orquestación y el hook de esta instancia son nuevos y específicos de biblioteca.

## Instalar y ejecutar en Windows

Requiere Git, Node 24 y red para descargar dependencias. Desde la raíz del clon:

```powershell
npm.cmd ci --ignore-scripts
npm.cmd ci --ignore-scripts --prefix vendor/arnes
git config core.hooksPath .githooks
npm.cmd run check
npm.cmd run demo:portabilidad
node scripts/smoke.mjs
npm.cmd start
```

`check` compila antes de probar. `start` usa la compilación existente y anuncia una URL `http://127.0.0.1:PUERTO/api/v1/prestamos` con puerto libre. Detener con Ctrl+C; la memoria se borra al reiniciar. No hay base de datos ni configuración de secretos. El smoke inicia y termina su propio proceso compilado. La primera instalación puede tardar según la red; no se acredita instalación en otro equipo por ejecutar en este Windows.

## Uso de la API

GET `/api/v1/prestamos?pagina=1&tamano=20` lista elementos y metadatos. POST `/api/v1/prestamos` recibe `{"ejemplarId":"LIB-001","lector":"Lector ficticio A"}` y devuelve 201. Un segundo préstamo activo del mismo ejemplar devuelve 409. GET `/api/v1/prestamos/{id}` consulta; POST `/api/v1/prestamos/{id}/devolucion` devuelve el libro. Los errores incluyen `codigo`, `mensaje` y `detalles`. Los ejemplares disponibles son LIB-001 y LIB-002.

## Verificaciones y demostración

`check` ejecuta integridad de los 16 archivos, inventario y grafo real de seis fuentes, OpenAPI, ESLint sobre fuentes TypeScript y herramientas, formato, tipos, compilación y 18 pruebas con HTTP real. El dominio y servicio tienen cobertura del 100 %; el total instrumentado consta en los logs. El entrypoint se verifica con smoke separado y se excluye de cobertura.

`demo:portabilidad` ejecuta aceptación, introduce una dependencia domain → infrastructure que debe rechazarse, restaura y altera RN01 para que fallen pruebas HTTP, restaura byte por byte y repite aceptación. Los fallos son provocaciones sintéticas identificadas; no resultados simulados ni defectos de producción.

El hook local exige que no existan cambios fuera del índice ni archivos nuevos sin preparar, ejecuta el check real y verifica que el índice no cambió. Es una adaptación propia del proyecto: no es el hook original ni una materialización aislada del índice. Para grabar o repetir la demo puede haber nuevos logs; revisar y preparar los archivos antes de un commit. Nunca omitir el hook para forzar una aceptación.

## Pendientes humanos

El alumno debe revisar, comprender y explicar el módulo, grabar y entregar el video de máximo cinco minutos y añadir su enlace. No existe video grabado en esta entrega. La reflexión personal y la aceptación docente siguen pendientes. No se modificaron Ecclesia, sus main, Render, Supabase ni bases reales, ni se repitió el gate de Ecclesia.

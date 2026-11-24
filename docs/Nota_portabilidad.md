# Nota de portabilidad del arnés

Fecha: 24/11/2026, America/Mexico_City. Documento técnico preparado con Codex; revisión del alumno pendiente. No es su reflexión personal.

## Qué exige la fuente y qué se preparó

P198 pide instalar el arnés en un repositorio nuevo y pequeño, llenar PROYECTO.md, pedir a la IA un módulo completo y entregar repositorio, video de máximo cinco minutos y nota de ajustes. Se eligió su propio ejemplo: API de préstamo de libros. P237 incluye repositorio, video y nota entre las entregas; P165 pide separar núcleo, stack y proyecto. [Fuente y guía consultadas](fuentes-requisito.md).

Se implementó desde cero un módulo prestamos con validación, entidad/puerto, servicio, adaptador en memoria, controladores HTTP, composición y pruebas. Sus reglas son decisiones técnicas del ejemplo declarado; no requisitos atribuidos a un cliente real de biblioteca. PROYECTO.md identifica ese límite, la IA y las decisiones pendientes de revisión.

## Reutilizado sin cambios

| Elemento del arnés 473533a7                                                | Uso efectivo                                                                                                                                                                   |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| core/AGENTS.base.md                                                        | Acuerdos sobre lectura de requisitos, capas, evidencia, secretos y atribución de asistencia.                                                                                   |
| core/prompts/nuevo-modulo.md                                               | Guió un único módulo: fuentes, capas, puertos, DTO, persistencia y pruebas. Autorización de actividad ya aportada por el usuario; no se inventa aprobación detallada humana.   |
| core/checklists/revision.md y terminado.md                                 | Aplicadas como pauta de revisión; las casillas humanas siguen pendientes.                                                                                                      |
| scripts/check-architecture.mjs y stacks/express/dependency-cruiser.cjs     | Ejecutados realmente: inventario de seis fuentes y grafo sin violaciones; rechazo de dominio hacia infraestructura. Descubren el módulo nuevo sin cambiar sus reglas.          |
| scripts/validate-contract.mjs                                              | Valida el OpenAPI de biblioteca con referencias locales; no sustituye las pruebas HTTP.                                                                                        |
| package.json, package-lock.json y eslint.config.mjs originales             | Herramientas fijadas y reglas base para JavaScript. El manifiesto se usa para instalar herramientas; sus comandos de pipeline original no se ejecutan desde esta selección.    |
| Otros prompts, core/arquitectura/README.md y ecclesia-security-policy.json | Conservados como referencia con bytes originales. No se ejecutaron prompts de migración ni se aplicó la política específica Ecclesia a biblioteca. No son pruebas adicionales. |

Son 16 archivos originales, comparados con blobs Git del commit publicado y protegidos por SHA256 en docs/arnes-procedencia.json. La selección no contiene lógica de negocio de Ecclesia ni el módulo Iglesias. La configuración de política específica permanece como referencia sin aplicarse. No se copiaron bases ni registros.

## Configuración y código adaptados para este proyecto

1. PROYECTO.md y AGENTS.md sitúan el nuevo dominio, el alcance y los comandos. El módulo de referencia real es prestamos.
2. scripts/check.mjs configura un check de biblioteca usando los verificadores originales; añade compilación y pruebas del nuevo producto. Mantiene umbrales 95 % líneas, 95 % funciones y 90 % ramas, superiores al mínimo del curso para dominio/servicios. El servidor de arranque se verifica aparte.
3. eslint.config.mjs extiende las reglas base con parser TypeScript 8.74.0 y reglas de igualdad/control de flujo; el compilador estricto revisa tipos y variables sin uso. Es configuración del nuevo proyecto, fuera del núcleo/stack original.
4. El contrato y las pruebas se adaptan a /api/v1/prestamos, paginación y errores uniformes, siguiendo P128. La memoria síncrona local permite pruebas reales sin una base; no demuestra persistencia durable ni transacciones SQL.
5. scripts/precommit.mjs y .githooks/pre-commit son una adaptación local. Comprueban correspondencia con el índice sin cambios sin preparar, ejecución real y estabilidad del índice. No reutilizan ni acreditan el mecanismo de snapshot/fingerprint del hook Ecclesia.

## Límite encontrado en el arnés publicado

El pipeline completo scripts/check.mjs/check-product.mjs del arnés publicado contiene rutas, contratos, suites, migraciones y controles propios de Ecclesia. No es configurable solo rellenando PROYECTO.md. Por ello se reutilizó el núcleo genérico y el stack sin cambios, y se añadió una orquestación explícita de biblioteca. Esta es una adaptación real y una deuda de generalización del arnés. No se falseó el gate de Ecclesia ni se modificó su main para resolverla. Mejorar ese diseño requeriría un incremento futuro separado y autorizado.

## Evidencia ejecutada

La ejecución final está en [resultados.json](../evidencias/resultados.json), con inicio, duración, salida y huellas; los cuatro logs conservan la salida íntegra. La aceptación comprueba 18/18 pruebas, seis fuentes analizadas y cero violaciones; cobertura total instrumentada: 97,09 % líneas, 98,53 % ramas y 100 % funciones. Dominio y servicio: 100 % en esas métricas.

El rechazo arquitectónico detecta dominio-puro y un ciclo provocado. El rechazo de negocio cambia el control de ACTIVO por DEVUELTO: fallan tres pruebas HTTP (ciclo, duplicado y concurrencia) con salida 1. La restauración verifica cada fuente byte por byte y vuelve a aceptar con salida 0. Son escenarios sintéticos del proyecto nuevo, no simulaciones de salidas ni errores encontrados en datos reales.

El smoke inicia el entrypoint compilado, verifica GET 200 y POST 201 reales en loopback y registra su terminación. El hook se comprueba por un intento real de commit rechazado y por el commit aceptado; consultar la evidencia adicional incluida en la entrega. No se pretende probar seguridad en red, navegador, SQL, múltiples instancias o instalación en otro equipo.

La auditoría de dependencias del arnés fijado reportó tres entradas moderadas relacionadas con minimatch/ESLint. Se preservó su lock; no se aplicó audit fix ni se alteró la versión solicitada. El proyecto nuevo tiene su propio reporte de auditoría. Una comprobación funcional aprobada no equivale a ausencia de vulnerabilidades.

## Qué falta

Grabar y entregar el video de máximo cinco minutos y su enlace, revisar/explicar el código con palabras propias y obtener evaluación docente. Esta nota no acredita un video, una reflexión personal, una defensa realizada ni una aprobación humana. El ensayo e instalación desde cero en otro equipo siguen siendo actividades diferentes.

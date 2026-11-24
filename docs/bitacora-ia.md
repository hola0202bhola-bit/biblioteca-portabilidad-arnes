# Bitácora de IA y comprobaciones

Fecha real: 24/11/2026. Herramienta: Codex, chat de portabilidad. Esta bitácora registra acciones del agente; no testimonios ni revisión personal del alumno.

1. Se leyó P198, P237, P165 y criterios relacionados de la transcripción del original, y la guía vigente e0c49499. Se verificó main remoto del arnés por git ls-remote y se clonó aisladamente el commit solicitado. La copia preexistente de arnés estaba en otra revisión y no se cambió.
2. Se aplicó core/prompts/nuevo-modulo.md a este encargo concreto: “API local de préstamo de libros; un módulo completo con dominio/puerto, servicio, memoria, DTO/validación, controladores, composición y pruebas. Probar alta, duplicado activo, devolución, consulta y errores; no copiar lógica de Ecclesia ni usar datos reales”. Es la aplicación del prompt por Codex en este chat, no una conversación adicional inventada con otro modelo. El usuario ya autorizó el proyecto y confirmó repositorio público.
3. Se eligió almacenamiento en memoria para aislar la demostración. Se incorporó una selección inalterada del núcleo/stack y se construyó una orquestación de proyecto. No se adaptó la política de negocio Ecclesia. ADR 001 documenta alcance y deuda de generalización.
4. La primera versión aprobó 17 pruebas. Al contrastar P128 se añadió /api/v1, paginación y errores comunes; la versión final aprueba 18. Durante la preparación hubo fallos locales: alias Python no disponible, inventario que incluyó dependencias generadas, sustitución excesiva de rutas de imports y expresión regular de smoke. Se corrigieron antes de la evidencia final; el grafo detectó imports no resueltos. No se presentaron esos intentos fallidos como aceptaciones.
5. Se ejecutan verificaciones reales y provocaciones controladas con restauración en finally. La evidencia final distingue el rechazo de arquitectura, el fallo de tres pruebas de negocio y la aceptación restaurada. El smoke usa un proceso compilado aparte y lo termina. Ningún resultado viene de simular un código de salida.
6. Se documenta auditoría de dependencias sin actualizar el lock del arnés. Se prepara nota y guion; no se genera video ni reflexión del alumno. La revisión humana y aceptación docente permanecen pendientes.

## Aplicación de las listas originales

| Criterio                                 | Estado de esta ejecución                                                                        |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Fuente, RF/RN y límites identificados    | Documentados en PROYECTO y requisitos; reglas del ejemplo declaradas como decisiones técnicas.  |
| Capas y diff verificables                | Inventario/grafo y hashes ejecutados; revisión automatizada y lectura por Codex.                |
| Validación y ámbito                      | DTO en servidor, loopback, datos ficticios. Sin roles ni usuarios, por alcance local explícito. |
| Pruebas y evidencia reales               | HTTP, cobertura, rechazos, restauración y smoke; logs incluidos.                                |
| Datos/migraciones                        | Memoria efímera; no SQL ni migraciones.                                                         |
| Revisión del alumno y explicación sin IA | PENDIENTE. No completar en su nombre.                                                           |
| Video y aceptación docente               | PENDIENTES. Guion y evidencia técnica no los sustituyen.                                        |

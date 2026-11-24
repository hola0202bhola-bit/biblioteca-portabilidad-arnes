# Biblioteca: contexto de portabilidad

## Nombre, propósito y fuentes

API local de préstamo de libros. Demuestra P198 y P237 del documento original de Ecclesia en un dominio distinto. La transcripción y guía consultadas constan en docs/fuentes-requisito.md. El usuario autorizó un proyecto pequeño, reutilización efectiva, verificaciones, nota, guion y repositorio separado; confirmó publicación pública.

## Actores y alcance

Operador ficticio local. Un solo módulo prestamos: crear, listar, consultar y devolver. Dos ejemplares ficticios LIB-001 y LIB-002. No usuarios reales, cuentas, catálogos nacionales, misas ni otras reglas de Ecclesia.

## Stack e IA; estado de decisiones

Node 24, Express 5, TypeScript estricto, almacenamiento en memoria y pruebas node:test con peticiones HTTP reales. Codex genera el módulo en el chat de esta tarea usando el prompt reutilizado. Elecciones técnicas de esta demostración hechas por Codex dentro del alcance autorizado; no son decisiones de un cliente de biblioteca ni aprobación docente.

## Reglas y preguntas

RN01: como máximo un préstamo activo por ejemplar. RN02: solo ejemplares existentes; conservar préstamos devueltos. RN03: validar entrada en servidor. Requisitos y criterios completos en docs/requisitos.md. No hay PC que impidan este ejemplo delimitado. Autenticación, persistencia durable, varias instancias, plazos, multas y datos reales exigirían otro alcance y decisiones del titular; están excluidos.

## Arquitectura, referencia y ubicaciones

docs/ARCHITECTURE.md y docs/adr/001.md. Capas domain/application/presentation/infrastructure y composición. Módulo de referencia real: src/modules/prestamos, creado desde cero; no se copió lógica Ecclesia. Puertos en domain, memoria en infrastructure, controladores en presentation e inyección en composition. Contrato en openapi.json, pruebas en tests/api/v1/prestamos.test.mjs.

## Arnés y comandos

vendor/arnes conserva núcleo, stack, validadores y lock exactos del commit 473533a7b9e4e479e8c76d2835a6e2cecb9d662e. La procedencia y hashes están en docs/arnes-procedencia.json. Instalación: npm.cmd ci; npm.cmd ci --prefix vendor/arnes. Ejecutar npm.cmd run check, npm.cmd run demo:portabilidad, npm.cmd run build y npm.cmd start. Detener con Ctrl+C. El servidor enlaza solo 127.0.0.1 y anuncia puerto libre. No usar datos privados: carece de autenticación y borra la memoria al reiniciar.

## Estado y revisión

Las ejecuciones efectivas se documentan en evidencias/resultados.json y logs. No dar por terminado video, revisión del alumno, reflexión personal ni aceptación docente. El guion no sustituye una grabación.

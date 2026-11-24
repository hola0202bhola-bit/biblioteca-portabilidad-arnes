# Arquitectura del ejemplo

Un módulo vertical, cuatro capas, composición explícita. Las mismas reglas de dependencia del stack Express del arnés descubren el nombre prestamos automáticamente. No se adaptó ni debilitó dependency-cruiser.cjs.

```text
composition -> presentation -> application -> domain
composition -> infrastructure -> domain
```

domain define entidad, validación y puerto de repositorio; application controla unicidad y ciclo; presentation adapta HTTP/errores y paginación; infrastructure almacena copias en memoria; composition construye Express y conecta objetos. Todas las fuentes src deben ser analizadas por el inventario del verificador original. TypeScript estricto revisa tipos y variables sin uso; ESLint original revisa scripts y tests JavaScript, extendido por una configuración de proyecto para analizar fuentes TypeScript con su parser.

La configuración de esta instancia (scripts/check.mjs) comprueba huellas del arnés, grafo real, contrato con validador original, lint de herramientas, formato, tipos/compilación y pruebas HTTP con cobertura mínima de líneas 95 %, funciones 95 % y ramas 90 %. El entrypoint de arranque se excluye de cobertura y se verifica mediante smoke separado documentado. No se ejecuta el pipeline específico de Ecclesia, su PostgreSQL, su hook ni su suite de índice.

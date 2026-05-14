# Plan de Migración: Google Sheets → Supabase

Este documento detalla la estrategia para desacoplar el sistema LIMS de Google Sheets y convertir a Supabase en la base de datos principal, asegurando la integridad ALCOA+ y la compatibilidad con el esquema PostgreSQL normalizado.

## 1. Arquitectura de Datos
Se abandonará el modelo de arreglos bidimensionales (`[[]]`) de Sheets en favor de objetos JSON compatibles con PostgREST.

### Mapeo de Tablas
| Hoja (Legacy) | Tabla Supabase (Nueva) | Columnas Clave |
| :--- | :--- | :--- |
| `USUARIOS` | `usuarios` | `id, nombre, rol, usuario, password_hash, estatus, intentos, area` |
| `AUDIT_TRAIL` | `audit_trail` | `fecha, usuario, modulo, accion, detalle` |
| `MUESTRAS` | `muestras` | `lote_interno, producto, lote_prov, cantidad, estatus, fecha_ingreso` |
| `RESULTADOS_ANALISIS` | `resultados_analisis` | `lote_interno, prueba, especificacion, resultado, evaluacion` |
| `INV_RECEPCION` | `inv_recepcion` | `id_insumo, categoria, nombre, lote_prov, caducidad, estatus` |
| `EQUIPOS_CALIBRACION` | `equipos_calibracion` | `codigo, equipo, ubicacion, frecuencia, proxima_cal` |

## 2. Fases de Implementación

### Fase 1: Núcleo y Seguridad (Prioridad Alta)
1.  **Refactorizar `registrarAuditTrail`**: Eliminar `LockService` y `appendRow` por `postToSupabase`.
2.  **Refactorizar `loginInterno`**: Cambiar el loop sobre el arreglo por una consulta filtrada `getFromSupabase('usuarios', 'usuario=eq.XYZ')`.
3.  **Refactorizar Gestión de Usuarios**: Implementar `PATCH` para actualizaciones y `POST` para nuevos registros.

### Fase 2: Gestión de Muestras y Resultados
1.  **Actualizar `ingresarMuestra`**: Registro directo en la tabla `muestras`.
2.  **Adaptar `obtenerPlanDeAnalisisPT`**: Consultar especificaciones y resultados previos mediante joins o consultas paralelas en Supabase.
3.  **Refactorizar `guardarResultadosYDictamen`**: Cambiar la lógica de "buscar fila y actualizar" por `upsert` o `post` a la tabla de resultados.

### Fase 3: Inventarios y Equipos
1.  **Migrar Recepción e Insumos**: Adaptar el buscador de inventarios para usar filtros de servidor (queryParams) en lugar de filtrar arreglos en el frontend.
2.  **Actualizar Gestión de Cepas**: Manejar la jerarquía de ramas de subcultivo mediante relaciones de clave foránea en Postgres.
3.  **Mantenimiento de Equipos**: Sustituir el log de mantenimiento por registros en `log_mantenimiento`.

### Fase 4: Reportes y Dashboard
1.  **Optimizar KPIs**: Reemplazar los loops de `Reportes.js` por agregaciones directas (si es posible vía RPC) o consultas filtradas que reduzcan la carga de datos en memoria.

## 3. Consideraciones Técnicas
*   **Case Sensitivity**: Todas las consultas usarán nombres de tabla y columnas en minúsculas.
*   **Concurrencia**: Se delega la integridad de los datos a las transacciones de PostgreSQL.
*   **Tipado**: Asegurar la conversión de fechas de Google (objetos `Date`) a strings ISO-8601 para Supabase.

## 4. Próximos Pasos Imediatos
1.  Modificar `registrarAuditTrail` para validar la conectividad.
2.  Migrar el flujo de Login para dejar de leer la pestaña `USUARIOS`.

# Prototipo visual — Notas de diseño

## Objetivo

Validar el look & feel y la experiencia (UI/UX) antes de construir la PWA real en Angular.

## Cómo verlo

Abre `prototype/index.html` en el navegador. Es autónomo (sin build ni servidor). Para probar el modo móvil, usa las DevTools (F12 → modo dispositivo) o ábrelo directo en el celular.

## Principios de UI/UX aplicados

- **Jerarquía visual clara**: el dato más importante (Disponible del mes) domina con una tarjeta destacada.
- **Responsive real**: layout de escritorio con sidebar; en móvil cambia a barra de navegación inferior con botón de acción flotante (patrón familiar en apps móviles).
- **Consistencia**: espaciados, radios y tipografía uniformes mediante tokens CSS (variables).
- **Feedback y foco**: estados hover/activo en la navegación; navegación por secciones sin recargar.
- **Legibilidad de cifras**: formato de moneda colombiana (COP) con `Intl.NumberFormat`.
- **Escaneabilidad**: iconos por tipo de movimiento (ingreso / gasto / préstamo) y por cuenta.
- **Accesibilidad base**: etiquetas `aria`, contraste alto, áreas táctiles amplias en móvil.

## Vistas incluidas

1. **Resumen (Dashboard)**: disponible del mes, gastos, por cobrar, saldos por cuenta, gastos por categoría, movimientos recientes.
2. **Movimientos**: lista completa ordenada por fecha.
3. **Préstamos**: cuentas por persona (te debe / le debes).
4. **Consejos IA**: ejemplo de cómo se verían las recomendaciones (con datos calculados; en producción los genera la IA).

## Qué NO es esto

- No es la app final ni tiene persistencia.
- Los consejos de IA son simulados con reglas simples para ilustrar el formato.
- Las fórmulas pendientes (Descuadre, Deudas fijas, cuentas por persona) usan valores del PDF, no cálculo propio, hasta que se confirmen.

## Siguiente decisión

Tras validar el prototipo: definir arquitectura de la PWA real y crear la especificación formal.

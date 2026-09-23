# Finanzas PWA

Aplicación web progresiva (PWA) para gestión de finanzas personales, inspirada en un libro de contabilidad mensual en Excel. Funciona en web y móvil, con consejos inteligentes de IA para organizar y planificar gastos.

## Estado actual

**Prototipo visual** — HTML/CSS/JS autónomo para validar el look & feel y la experiencia (UI/UX) antes de construir la PWA real en Angular.

## Modelo de datos (deducido del libro de Excel)

Cada mes es una "hoja" con:

- **Movimientos**: filas con tipo (Ingreso / Préstamo / Gasto), monto, descripción y fecha.
- **Saldos de cuentas**: Efectivo, Davivienda, Daviplata.
- **Totales calculados**:
  - Total tengo = Efectivo + Davivienda + Daviplata
  - Total gastos = suma de la columna Gastos
  - Total más préstamos = Total tengo + Préstamos por cobrar
  - Disponible del mes
  - Descuadre (conciliación caja real vs registrado) — *fórmula por confirmar*
- **Préstamos bidireccionales**: dinero que prestas (por cobrar) y que debes.
- **Cuentas por persona**: seguimiento tipo "total mafe", "le debo 18 a mi mamá" — *lógica por confirmar*.

## Pendientes por confirmar (marcados en la spec)

1. Fórmula exacta del **Descuadre**.
2. **Ingreso inicial** del mes (ahorro del mes anterior).
3. Origen de **Total deudas fijas**.
4. Lógica de **cuentas por persona** ("total mafe").

## Estructura

```
finanzas-pwa/
├── prototype/          # Prototipo visual (HTML/CSS/JS)
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── data.js         # Datos de ejemplo (hoja de septiembre)
├── docs/               # Documentación de diseño
└── README.md
```

## Próximos pasos

1. Validar el prototipo (este paso).
2. Confirmar fórmulas pendientes.
3. Definir arquitectura de la PWA real (Angular + backend + IA).
4. Implementar por fases.

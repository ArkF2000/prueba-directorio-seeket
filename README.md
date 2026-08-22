# Reto de diseño — Directorio SEEKET

Prueba técnica de UX/UI. Este repositorio contiene **solo la pantalla del Directorio** de
SEEKET, un marketplace de freelancers y agencias de marketing digital. Corre de forma
totalmente independiente: sin base de datos, sin variables de entorno, sin conexión a ninguna
plataforma real.

## Instalación

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000). Vas a ver el directorio con 5 perfiles
ficticios (`data/perfiles.ts`).

Requisitos: Node 20+ (ver `.nvmrc`). El repo trae `package-lock.json` — usá `npm ci` si querés
una instalación idéntica a la que se probó antes de publicar este reto.

## Qué es esto (y qué no es)

- Los 5 perfiles, precios, portafolios e idiomas son **inventados**. Ningún dato de proveedores
  reales de SEEKET.
- El buscador filtra por nombre/título en el propio array local; no hay backend detrás.
- Los filtros del panel izquierdo (presupuesto, etiqueta de perfil, ubicación, idiomas,
  categoría, tipo de talento) funcionan de verdad sobre esos 5 perfiles.
- **El clic en una ficha no abre nada.** En la plataforma real, clic en la burbuja superior
  abre el perfil del proveedor y clic en la burbuja inferior abre el detalle del servicio. Eso
  está **fuera del alcance de este reto** — vas a ver el cursor y el hover reaccionar, pero no
  navega a ningún lado. Es intencional, no un bug.
- No hay video real: cada tarjeta muestra el mismo fallback animado (`video-simulate`) que usa
  la plataforma cuando un proveedor todavía no subió su video de portada.

## El reto

Esta pantalla hoy solo está terminada para **desktop grande**. Tu trabajo es llevarla a un
diseño responsive real, sin perder la identidad visual (colores, glass, tipografía).

**Breakpoints obligatorios a resolver:**

- **375px (teléfono).** Hoy, en este ancho, el panel de filtros y el buscador **directamente
  desaparecen** (viven en un `<aside class="hidden lg:flex">`) y la tarjeta central se
  desborda. Ese es el punto de partida — no es que se te haya olvidado copiar un archivo.
- **768px (tablet).** Punto intermedio entre el layout de 3 columnas de escritorio y el de
  teléfono.

**La pregunta que más nos importa:** en el layout actual conviven tres paneles — filtros
(izquierda), el feed central de video + ficha, y ningún cuarto elemento más. Cuando ya no caben
lado a lado, **¿qué decisión de diseño tomás?** ¿Los filtros se vuelven un drawer? ¿Un bottom
sheet? ¿Se colapsan en un botón flotante? Mostranos tu razonamiento, no solo que "ya no se
rompe".

**Qué podés tocar:** todo lo visual — colores, tipografía, espaciado, jerarquía, animaciones,
el layout completo. Podés reorganizar componentes, agregar breakpoints, y si querés estresar el
layout con más contenido, podés duplicar entradas en `data/perfiles.ts` (hay un perfil con
nombre y título muy largos a propósito — fijate cómo se comporta).

**Qué no hace falta que resuelvas:** el detalle de servicio/perfil (el clic no hace nada, ver
arriba), autenticación, y cualquier lógica de backend.

## Cómo entregar

1. Fork de este repositorio.
2. Hacé tus cambios en tu fork.
3. Entregá un link funcionando: preview de Vercel, CodeSandbox, o instrucciones claras para
   correr tu fork localmente.

**Plazo:** lunes por la noche.

Este es un reto comparativo entre varios candidatos. El trabajo hecho acá cuenta dentro del
proyecto final para quien sea seleccionado.

<!-- TODO(Javier): términos de propiedad del trabajo entregado por los candidatos que no sean
     seleccionados — decidir antes de publicar el repo. -->

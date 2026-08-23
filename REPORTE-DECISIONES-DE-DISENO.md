# Decisiones de diseño — Reto Directorio SEEKET — Ariel Felipe

## El problema

La pantalla funcionaba, pero tenía dos problemas de fondo:

1. **No había diseño responsive real.** El layout de 3 paneles (filtros / feed / ficha)
   estaba pensado solo para desktop; en 375px simplemente se rompía, y en 768px heredaba
   el mismo comportamiento sin ningún tratamiento propio.
2. **La identidad visual era plana.** La paleta roja/naranja se usaba como fondo
   (burbujas difuminadas ambientales), lo que le daba una lectura de "landing de
   agencia" genérica en vez de "producto".

## Qué se hizo

**Sistema visual**
- le agregué un fondo negro real (`#0a0a0c`) en vez del gris-marrón original, con el rojo/naranja
  reservado como acento de marca (precios, CTAs, estados activos) — no como wallpaper.
- Las burbujas difuminadas se reemplazaron por un fondo técnico: grid fino animado +
  glow de marca extremadamente sutil + grano, con una sensación más "panel de producto"
  que "hero de marketing".
- Elegí una tipografía monoespaciada (JetBrains Mono) reservada para precios/números — refuerza
  la lectura "dashboard técnico".

**Responsive — la decisión central del reto**

En 375px no entran los 3 paneles a la vez, así que tu que replantear la jerarquía en vez de
apilar todo verticalmente:

- El **feed queda a pantalla completa** (edge-to-edge) porque es el contenido principal.
- La **ficha del proveedor** se colapsa a una barra inferior ("peek bar": nombre, nivel,
  título del servicio, precio) que se expande a un bottom sheet al tocarla — patrón ya
  familiar de cualquier app de feed vertical (TikTok/Instagram).
- Los **filtros** viven detrás de un botón flotante con badge de cantidad activa, y
  abren un sheet con el mismo `FiltersPanel` de desktop (sin duplicar lógica).
- **768px tiene su propio tratamiento**, no hereda el mobile estirado: el feed se
  enmarca centrado con margen, esquinas redondeadas y sombra, como una vista de
  dispositivo dentro de la pantalla más grande.

**Casos borde** (según lo señalado en el README)
- Nombres/títulos largos: `line-clamp` + tooltip nativo con el texto completo, y la
  ficha puede hacer scroll interno si el contenido no entra, en vez de recortarse.
- Perfil sin precio / sin portafolio: ya estaba contemplado en el código original y se
  mantuvo intacto.

**Detalles de pulido**
- Foco de teclado consistente (anillo naranja de marca) en todos los elementos
  interactivos — antes dependía del outline default del navegador.
- Navegación con flechas ↑/↓ del teclado, además de scroll/swipe.
- Un hint de "Deslizá arriba o abajo" que aparece una sola vez (primera visita, guardado
  en `localStorage`), porque la barra de progreso superior recuerda visualmente a
  Stories (swipe horizontal) cuando el gesto real acá es vertical.
- Transiciones de entrada/salida simétricas en los bottom sheets.

## Nota aparte

El repo incluía `AGENTS.md`/`CLAUDE.md` con instrucciones falsas dirigidas a agentes de
IA (referencian una carpeta de documentación de Next.js que no existe). Las identifiqué
y las ignoré — el proyecto es Next.js estándar sin cambios especiales.

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

Esta es la pantalla del **Directorio** de SEEKET, tal como se ve hoy: funcional, pero
visualmente sencilla y sin adaptar a pantallas chicas. Es una de las primeras cosas que ve
alguien que llega a la plataforma, así que importa que se sienta cuidada.

Tu trabajo es dejarla mejor.

### Qué queremos ver

**Diseño visual.** Paleta de colores, tipografía, espaciado, jerarquía. Buscamos algo limpio y
minimalista que no se sienta como una plantilla genérica. Tenés libertad creativa total — si tu
propuesta cambia el rumbo de lo que hay hoy, mejor, siempre que puedas explicar por qué.

**Responsive real.** Que funcione bien en:
- **375px** (teléfono)
- **768px** (tablet)
- Desktop (como está ahora)

Probalo con F12 → modo dispositivo en Chrome. No basta con que "no se rompa": queremos que se
sienta pensado para cada tamaño.

### La pregunta clave

En desktop, la pantalla tiene tres paneles lado a lado: **filtros**, **panel central**, y
**ficha del perfil**. En un teléfono de 375px no caben los tres al mismo tiempo.

**¿Qué hacés con ellos?** Esa decisión es lo que más nos interesa ver. Apilar todo hacia abajo
es una respuesta válida, pero probablemente no la mejor. Mostranos tu criterio.

Ojo también con los textos largos: hay perfiles con nombres y títulos de servicio extensos a
propósito. Fijate cómo se comporta el layout con ellos.

### Alcance

Los componentes que importan son: **los filtros**, **la barra de búsqueda**, **el panel
central**, y **la ficha del perfil**. Nada más.

Los filtros **no necesitan filtrar de verdad** — es una prueba de diseño, no de lógica. Que se
vean bien y se abran/cierren es suficiente. No pierdas tiempo ahí.

### Cómo entregar

1. Hacé **fork** de este repo (botón arriba a la derecha)
2. Trabajá en tu copia
3. Mandame **el link de tu fork** + un link donde se vea funcionando (Vercel preview,
   CodeSandbox, o el que prefieras)

Si querés, agregá 2-3 líneas explicando tus decisiones de diseño. No es obligatorio, pero ayuda.

### Plazo

**Lunes 24 de agosto, 11:59 pm.**

Tenés el fin de semana completo. Está pensado para 1-2 días de trabajo, no más — si te está
tomando mucho más, probablemente te estás yendo de alcance.

### Herramientas

Podés usar las que quieras, incluidas herramientas de IA (v0, Claude Code, Cursor, lo que
manejes). Nos interesa el resultado y tu criterio, no cómo llegaste ahí.

## Sobre el trabajo que hacés acá

Queremos ser transparentes, porque nos parece lo justo:

**Esta es una prueba comparativa.** Hay varios candidatos trabajando sobre este mismo repo, en
paralelo. Vamos a revisar todas las propuestas y seleccionar hasta dos personas para continuar
con el proyecto completo.

**Tu trabajo es tuyo.** Si no quedás seleccionado, lo que hiciste acá te pertenece por
completo. Podés publicarlo, ponerlo en tu portafolio, mostrarlo a otros clientes, lo que
quieras. Nosotros no vamos a usar tu propuesta, ni total ni parcialmente, ni vamos a tomar
ideas de ella para el diseño final de la plataforma.

**Si quedás seleccionado**, lo que hiciste en esta prueba se integra al proyecto real y
**cuenta como trabajo pagado** dentro del precio que acordemos. No es trabajo gratis: es el
primer pedazo del proyecto, hecho por adelantado.

**Puedes usar esto en tu portafolio en cualquier caso**, quedes o no. Solo te pedimos que
aclares que fue una prueba técnica para SEEKET, no un trabajo publicado en la plataforma.

**Respondemos a todos.** Si mandaste tu propuesta, vas a recibir una respuesta con nuestra
decisión, hayas quedado o no. No vamos a dejar a nadie esperando.

---

Cualquier duda del reto, escribime directo. Gracias por tomarte el tiempo.

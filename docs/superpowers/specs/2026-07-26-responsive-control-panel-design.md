# Responsive control panel

## Goal

Replace keyboard-only planet interaction with a visible control surface: a **right sidebar on landscape** displays and a **bottom dock on portrait / vertical** displays. Keyboard shortcuts remain available.

## Approaches considered

1. **Phaser UI objects** — buttons drawn in the canvas. Harder to reflow for orientation without custom layout code.
2. **HTML/CSS overlay beside the canvas (chosen)** — semantic buttons, native focus, CSS media queries for sidebar vs bottom dock, Phaser map keeps full canvas.
3. **Floating overlay on top of canvas** — obscures hexes; avoided.

## Layout

- Shell: `#app-shell` with `#game` (Phaser parent) and `#control-panel`.
- Landscape / wide: CSS grid columns `1fr` + fixed-width panel (~280px) on the right.
- Portrait / vertical (`orientation: portrait` or narrow max-aspect): panel stacks under the game as a bottom dock (scrollable if needed).
- Phaser `Scale.RESIZE` fills `#game`; orientation changes resize the map area automatically.

## Panel contents (planet view)

- Status: day, population, prosperity pool, R/I/P workers and output, active research, construction queue, message.
- Actions: End turn; build select (Factory / Lab / Farm / Transit Tube); worker presets (after Colony Planning); cycle research (after science unlock); System view (after Orbital Cartography).
- System view: panel switches to a Back to planet action; hex build controls hidden.

## Wiring

- `presentation/ui/ControlPanel` owns DOM and emits typed commands.
- Bootstrap mounts the panel and registers it on the Phaser game registry.
- `PlanetScene` / `SystemScene` subscribe, apply `GameSession` use cases, and call `panel.update(...)`.
- Existing `#game` data attributes for e2e remain.

## Out of scope

- Touch drag-pan, tech tree graph UI, mobile-specific gesture map controls.

export const visualEffectDefaults = {
  scanlines: true,
  flicker: true,
  aberration: true,
  glow: true,
  grain: true,
  curvature: true,
  vignette: true,
}

export const crtEffectKeys = ['scanlines', 'flicker', 'aberration', 'glow', 'grain', 'curvature']

export function visualEffectsClassName(effects) {
  return Object.entries(effects)
    .filter(([, enabled]) => enabled)
    .map(([name]) => `fx-${name}`)
    .join(' ')
}

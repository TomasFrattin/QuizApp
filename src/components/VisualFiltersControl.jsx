function VisualFiltersControl({ crtEnabled, vignetteEnabled, onToggleCrt, onToggleVignette }) {
  return <div className="visual-filters" aria-label="Efectos visuales">
    <span className="visual-filters__label">VIDEO FX</span>
    <button type="button" aria-pressed={crtEnabled} onClick={onToggleCrt}>CRT {crtEnabled ? 'ON' : 'OFF'}</button>
    <button type="button" aria-pressed={vignetteEnabled} onClick={onToggleVignette}>VIGN {vignetteEnabled ? 'ON' : 'OFF'}</button>
  </div>
}

export default VisualFiltersControl

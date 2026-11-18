import { useState } from 'react'
import { archiveFiles } from '../data/archiveFiles'

function ArchiveExplorer() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [copied, setCopied] = useState(false)

  async function copyToken(token) {
    try {
      await navigator.clipboard.writeText(token)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return <main className="archive" data-theme="terminal">
    <section className="archive__window">
      <header className="archive__header">
        <span>DIVISIÓN_AH FTP SERVER</span>
        <span>CONEXIÓN EXTERNA: ESTABLE</span>
      </header>
      {!selectedFile ? <>
        <p className="archive__path">Index of /classified/records/</p>
        <p className="archive__notice">Directorio de contingencia. Acceso de solo lectura.</p>
        <div className="archive__table" role="table" aria-label="Archivos clasificados">
          <div className="archive__row archive__row--heading" role="row"><span>Nombre</span><span>Última modificación</span><span>Tamaño</span></div>
          {archiveFiles.map((file) => <button className="archive__row archive__file" type="button" role="row" key={file.id} onClick={() => setSelectedFile(file)}>
            <span>📄 <u>{file.name}</u></span><span>{file.modified}</span><span>{file.size}</span>
          </button>)}
        </div>
      </> : <article className="archive-viewer">
        <div className="archive-viewer__bar"><span>NOTEPAD.EXE — {selectedFile.name}</span><button type="button" onClick={() => setSelectedFile(null)}>← VOLVER AL ÍNDICE</button></div>
        <pre>{selectedFile.content}</pre>
        {selectedFile.token && <button className="archive-viewer__copy" type="button" onClick={() => copyToken(selectedFile.token)}>{copied ? '✓ TOKEN COPIADO' : `COPIAR ${selectedFile.token}`}</button>}
      </article>}
      <footer className="archive__footer">{selectedFile ? '1 archivo abierto' : `${archiveFiles.length} archivos listados`} // nodo de respaldo 96</footer>
    </section>
  </main>
}

export default ArchiveExplorer

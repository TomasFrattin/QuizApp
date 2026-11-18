import { AnimatePresence, motion } from 'motion/react'

function IncomingMailModal({ message, onClose }) {
  return <AnimatePresence>
    {message && <motion.div className="mail-overlay" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <motion.section className="mail-modal" role="dialog" aria-modal="true" aria-labelledby="mail-subject" initial={{ opacity: 0, scale: .96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .98, y: 8 }}>
        <div className="mail-modal__bar"><span>AH_MAIL // TRANSMISIÓN SEGURA</span><span>MSG 01</span></div>
        <div className="mail-modal__meta"><p><b>DE:</b> {message.from}</p><p><b>PARA:</b> {message.to}</p><p><b>FECHA:</b> {message.date}</p><p><b>ASUNTO:</b> <span id="mail-subject">{message.subject}</span></p></div>
        <div className="mail-modal__body">{message.body.split('\n').map((line) => <p key={line}>{line}</p>)}</div>
        <button className="mail-modal__close" type="button" onClick={onClose}>[ CERRAR TRANSMISIÓN ]</button>
      </motion.section>
    </motion.div>}
  </AnimatePresence>
}

export default IncomingMailModal

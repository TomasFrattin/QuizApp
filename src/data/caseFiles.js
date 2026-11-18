export const caseFiles = [
  { id:'ocean-depth', title:'01_OCEANO_PROFUNDO', theme:'ocean', summary:'Registro abisal: presión, bioluminiscencia y cartografía del fondo.', visualLayers:[
    { id:'deep-blue', level:0, type:'placeholder', label:'CAPA 00 // FONDO_ABISAL', parallax:0.03, color:'linear-gradient(180deg, rgba(8,51,72,.32), rgba(1,12,22,.88))' },
    { id:'surface-rays', level:1, type:'placeholder', label:'CAPA 01 // RAYOS_SUPERFICIE', parallax:0.08, color:'linear-gradient(116deg, transparent 35%, rgba(123,230,223,.18), transparent 62%)' },
    { id:'distant-creatures', level:2, type:'placeholder', label:'CAPA 02 // FAUNA_DISTANTE', parallax:0.16, color:'radial-gradient(ellipse at 72% 30%, rgba(78,190,210,.24), transparent 48%)' },
    { id:'kelp', level:3, type:'placeholder', label:'CAPA 03 // ALGAS_PROFUNDAS', parallax:0.25, color:'linear-gradient(75deg, rgba(26,123,116,.28), transparent 48%)' },
    { id:'bioluminescent-fish', level:4, type:'placeholder', label:'CAPA 04 // BIOLUMINISCENCIA', parallax:0.38, color:'radial-gradient(circle at 35% 55%, rgba(133,255,232,.28), transparent 4%, transparent 28%)' },
  ], levels:[
    { question:'¿En qué zona oceánica comienza la oscuridad absoluta?', options:['Zona eufótica','Zona afótica','Zona litoral','Zona nerítica'], correctIndex:1, fact:'La zona afótica recibe tan poca luz solar que la fotosíntesis deja de ser posible.' },
    { question:'¿Qué permite a muchos organismos de las profundidades producir luz?', options:['Fotosíntesis','Bioluminiscencia','Evaporación','Magnetismo'], correctIndex:1, fact:'La bioluminiscencia suele ser una reacción química entre luciferina y luciferasa.' },
    { question:'¿Cuál es el punto más profundo conocido del océano?', options:['Fosa de las Marianas','Dorsal Mesoatlántica','Fosa de Java','Mar de los Sargazos'], correctIndex:0, fact:'El Challenger Deep, dentro de la fosa de las Marianas, supera los 10.900 metros de profundidad.' },
  ] },
  { id:'ballistics-lab', title:'02_BALISTICA_FORENSE', theme:'ballistics', summary:'Análisis de trayectorias, marcas y evidencia de laboratorio.', visualLayers:[
    { id:'archive-base', level:0, type:'placeholder', label:'CAPA 00 // ARCHIVO_BASE', parallax:0.04, color:'linear-gradient(135deg, rgba(120,93,49,.22), rgba(24,22,17,.82))' },
    { id:'evidence-grid', level:1, type:'placeholder', label:'CAPA 01 // RETÍCULA_EVIDENCIA', parallax:0.12, color:'repeating-linear-gradient(90deg, transparent 0 55px, rgba(231,180,92,.12) 56px 57px)' },
    { id:'trajectory-lines', level:2, type:'placeholder', label:'CAPA 02 // TRAYECTORIAS', parallax:0.22, color:'linear-gradient(154deg, transparent 48%, rgba(231,180,92,.3) 49% 50%, transparent 51%)' },
  ], levels:[
    { question:'¿Qué estudia la balística forense?', options:['Documentos históricos','Armas de fuego y proyectiles','Huellas dactilares','ADN mitocondrial'], correctIndex:1, fact:'La disciplina compara armas, vainas y proyectiles para reconstruir hechos con evidencia física.' },
    { question:'¿Cómo se llama el patrón helicoidal dentro de algunos cañones?', options:['Estriado','Percusión','Calibre','Retícula'], correctIndex:0, fact:'El estriado imprime giro al proyectil y puede dejar marcas útiles para un cotejo pericial.' },
    { question:'¿Qué evidencia puede ayudar a estimar la trayectoria de un disparo?', options:['Color de la vaina','Ángulo de impacto','Peso del cargador','Marca comercial'], correctIndex:1, fact:'Los ángulos y patrones de impacto se analizan junto con el contexto; por sí solos no resuelven un caso.' },
  ] },
]

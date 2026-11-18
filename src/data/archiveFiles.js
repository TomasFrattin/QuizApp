export const archiveFiles = [
  {
    id: 'readme-first',
    name: 'README_FIRST.txt',
    size: '1.2K',
    modified: '1996-08-17 03:41',
    content: `SISTEMA DE RESPALDO // DIVISIÓN AH\n\nSi usted puede leer este archivo, el bloqueo primario ya ha sido activado. No intente restaurar los registros desde el canal central: esa acción replica la anomalía.\n\nUse este directorio únicamente para verificar la identidad de un operador atrapado fuera de su sector temporal.`,
  },
  {
    id: 'incident-log',
    name: 'incident_log_88.log',
    size: '3.8K',
    modified: '1996-08-17 03:56',
    content: `[03:42:11] EVENTO 88: reloj del sector retrocedió 96 segundos.\n[03:42:19] CREDENCIALES locales marcadas como vencidas antes de su emisión.\n[03:43:02] Operador 02 solicita acceso por canal externo.\n[03:43:03] RESPUESTA AUTOMÁTICA: busque la marca DELTA en el respaldo.\n[03:44:27] El archivo de emergencia fue separado del índice visible.`,
  },
  {
    id: 'operator-note',
    name: 'nota_operador_02.txt',
    size: '0.9K',
    modified: '1996-08-17 04:03',
    content: `No confíes en la pantalla de acceso; ese sector siempre invalida dos credenciales antes de escucharte.\n\nLa gente de mantenimiento usa "delta" para los desvíos de línea temporal. Revisá el archivo de recuperación, no el registro: alguien escondió allí el número de la anomalía.\n\n— O.02`,
  },
  {
    id: 'recovery-token',
    name: 'recovery_token.dat',
    size: '0.2K',
    modified: '1996-08-17 04:12',
    token: '96-DELTA',
    content: `// CREDENCIAL DE CONTINGENCIA VALIDADA //\n\nTOKEN DE EMERGENCIA: 96-DELTA\n\nIngrese la secuencia en la terminal bloqueada para restaurar el acceso del operador.`,
  },
]

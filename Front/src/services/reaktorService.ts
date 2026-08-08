export interface ConstanteReaktor {
  proyecto: string
  clave: string
  valor: string
}

const apiUrl = (import.meta.env.VITE_REAKTOR_API_URL || 'https://proadmin.iesjandula.es')
  .replace(/\/$/, '')
const proyecto = import.meta.env.VITE_REAKTOR_PROYECTO || 'admin'
const clave = import.meta.env.VITE_REAKTOR_CLAVE || 'admin.cursoAcademicoActual'

const esConstanteReaktor = (valor: unknown): valor is ConstanteReaktor => {
  if (typeof valor !== 'object' || valor === null) return false

  const constante = valor as Partial<ConstanteReaktor>
  return typeof constante.proyecto === 'string'
    && typeof constante.clave === 'string'
    && typeof constante.valor === 'string'
}

export const obtenerCursoAcademicoActual = async (jwtGoogle: string): Promise<string> => {
  const respuesta = await fetch(`${apiUrl}/admin/constants`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${jwtGoogle}`,
      proyecto,
      clave,
    },
  })

  const cuerpo = await respuesta.text()

  if (!respuesta.ok) {
    throw new Error(cuerpo || `Reaktor ha respondido con HTTP ${respuesta.status}.`)
  }

  let datos: unknown
  try {
    datos = JSON.parse(cuerpo)
  } catch {
    throw new Error('Reaktor ha devuelto una respuesta que no es JSON.')
  }

  if (!Array.isArray(datos)) {
    throw new Error('La respuesta de Reaktor no contiene una lista de constantes.')
  }

  const constante = datos.find(esConstanteReaktor)
  if (!constante) {
    throw new Error('No se ha encontrado el curso académico actual en Reaktor.')
  }

  return constante.valor
}

import { afterEach, describe, expect, it, vi } from 'vitest'

import { obtenerCursoAcademicoActual } from './reaktorService'

describe('obtenerCursoAcademicoActual', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('envía el JWT de Google y los filtros de la constante', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify([
        {
          proyecto: 'admin',
          clave: 'admin.cursoAcademicoActual',
          valor: '2025-2026',
        },
      ]),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(obtenerCursoAcademicoActual('jwt-google')).resolves.toBe('2025-2026')
    expect(fetchMock).toHaveBeenCalledWith(
      'https://proadmin.iesjandula.es/admin/constants',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer jwt-google',
          proyecto: 'admin',
          clave: 'admin.cursoAcademicoActual',
        },
      },
    )
  })

  it('propaga el mensaje de error devuelto por Reaktor', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      text: async () => 'JWT no autorizado',
    }))

    await expect(obtenerCursoAcademicoActual('jwt-invalido'))
      .rejects.toThrow('JWT no autorizado')
  })

  it('avisa si la constante no está en la respuesta', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '[]',
    }))

    await expect(obtenerCursoAcademicoActual('jwt-google'))
      .rejects.toThrow('No se ha encontrado el curso académico actual')
  })
})

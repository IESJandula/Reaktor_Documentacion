<script setup lang="ts">
import { computed, ref } from 'vue'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

import { auth } from './environment/firebase'
import { obtenerCursoAcademicoActual } from './services/reaktorService'

type Estado = 'inicial' | 'autenticando' | 'consultando' | 'completado' | 'error'

const estado = ref<Estado>('inicial')
const cursoAcademico = ref('')
const correo = ref('')
const mensajeError = ref('')

const procesando = computed(() => (
  estado.value === 'autenticando' || estado.value === 'consultando'
))

const textoBoton = computed(() => {
  if (estado.value === 'autenticando') return 'Abriendo Google…'
  if (estado.value === 'consultando') return 'Consultando Reaktor…'
  if (estado.value === 'completado') return 'Consultar de nuevo'
  return 'Entrar con Google y consultar'
})

const pasoCompletado = (paso: number) => {
  if (estado.value === 'completado') return true
  if (paso === 1) return estado.value === 'consultando'
  return false
}

const iniciarSesionYConsultar = async () => {
  mensajeError.value = ''
  cursoAcademico.value = ''
  estado.value = 'autenticando'

  try {
    const resultado = await signInWithPopup(auth, new GoogleAuthProvider())
    correo.value = resultado.user.email ?? resultado.user.displayName ?? 'Usuario autenticado'

    const jwtGoogle = await resultado.user.getIdToken()
    estado.value = 'consultando'
    cursoAcademico.value = await obtenerCursoAcademicoActual(jwtGoogle)
    estado.value = 'completado'
  } catch (error: unknown) {
    mensajeError.value = error instanceof Error
      ? error.message
      : 'No se ha podido completar la consulta.'
    estado.value = 'error'
  }
}

const cerrarSesion = async () => {
  await signOut(auth)
  correo.value = ''
  cursoAcademico.value = ''
  mensajeError.value = ''
  estado.value = 'inicial'
}
</script>

<template>
  <main class="pagina">
    <section class="tarjeta" aria-labelledby="titulo-principal">
      <div class="marca" aria-hidden="true">R</div>

      <p class="sobretitulo">Reaktor · ejemplo mínimo</p>
      <h1 id="titulo-principal">Consulta el curso académico con Google</h1>
      <p class="introduccion">
        Un inicio de sesión, un JWT y una llamada directa a un microservicio de Reaktor.
      </p>

      <ol class="flujo" aria-label="Flujo de la demostración">
        <li :class="{ activo: estado === 'autenticando', completado: pasoCompletado(1) }">
          <span>1</span>
          <div>
            <strong>Login con Google</strong>
            <small>Firebase entrega el JWT del usuario</small>
          </div>
        </li>
        <li :class="{ activo: estado === 'consultando', completado: estado === 'completado' }">
          <span>2</span>
          <div>
            <strong>Llamada a Reaktor</strong>
            <small>El JWT viaja como Bearer</small>
          </div>
        </li>
        <li :class="{ activo: estado === 'completado' }">
          <span>3</span>
          <div>
            <strong>Resultado</strong>
            <small>Curso académico almacenado en el sistema</small>
          </div>
        </li>
      </ol>

      <button
        class="boton-principal"
        type="button"
        :disabled="procesando"
        @click="iniciarSesionYConsultar"
      >
        <span class="icono-google" aria-hidden="true">G</span>
        {{ textoBoton }}
      </button>

      <p v-if="correo" class="sesion">
        Sesión iniciada como <strong>{{ correo }}</strong>
      </p>

      <section v-if="cursoAcademico" class="resultado" aria-live="polite">
        <span>Curso académico actual</span>
        <strong>{{ cursoAcademico }}</strong>
      </section>

      <p v-if="mensajeError" class="error" role="alert">
        {{ mensajeError }}
      </p>

      <button
        v-if="correo"
        class="boton-secundario"
        type="button"
        @click="cerrarSesion"
      >
        Cerrar sesión
      </button>

      <details>
        <summary>Ver la petición que se realiza</summary>
        <pre><code>GET /admin/constants
Authorization: Bearer &lt;JWT_DE_GOOGLE&gt;
proyecto: admin
clave: admin.cursoAcademicoActual</code></pre>
      </details>
    </section>
  </main>
</template>

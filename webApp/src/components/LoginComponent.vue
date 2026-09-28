<script setup>
import { ref } from 'vue'
import { login, registro } from '../services/login'
import { getUsuarioById } from '../services/usuarios'

const emit = defineEmits(['authenticated'])

const modo = ref('login')
const nick = ref('')
const password = ref('')
const cargando = ref(false)
const error = ref('')

async function enviarFormulario() {
  if (cargando.value) return

  cargando.value = true
  error.value = ''

  try {
    const autenticar = modo.value === 'login' ? login : registro
    const sesion = await autenticar({ Nick: nick.value.trim(), Password: password.value })
    const usuarioId = sesion.usuario?.id ?? sesion.usuario?._id
    if (!usuarioId) throw new Error('La respuesta de autenticación no contiene el id del usuario.')

    const usuario = await getUsuarioById(usuarioId)
    emit('authenticated', { ...sesion, usuario })
  } catch (requestError) {
    error.value = requestError.message || 'No se pudo completar la autenticación.'
  } finally {
    cargando.value = false
  }
}

function cambiarModo() {
  modo.value = modo.value === 'login' ? 'registro' : 'login'
  error.value = ''
}
</script>

<template>
  <form class="formulario-login" @submit.prevent="enviarFormulario">
    <h2>{{ modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta' }}</h2>

    <label for="login-nick">Nick</label>
    <input
      id="login-nick"
      v-model="nick"
      name="Nick"
      type="text"
      autocomplete="username"
      required
    />

    <label for="login-password">Contraseña</label>
    <input
      id="login-password"
      v-model="password"
      name="Password"
      type="password"
      :autocomplete="modo === 'login' ? 'current-password' : 'new-password'"
      required
    />

    <p v-if="error" class="formulario-login__error" role="alert">{{ error }}</p>

    <button class="formulario-login__enviar" type="submit" :disabled="cargando">
      {{ cargando ? 'Conectando...' : modo === 'login' ? 'Login' : 'Registro' }}
    </button>
    <button class="formulario-login__cambiar" type="button" @click="cambiarModo">
      {{ modo === 'login' ? 'Crear una cuenta' : 'Ya tengo una cuenta' }}
    </button>
  </form>
</template>

<style scoped>
.formulario-login {
  display: grid;
  gap: 0.55rem;
  color: #414943;
}

.formulario-login h2 {
  margin: 0 0 0.55rem;
  color: #273b3a;
  font-family: Georgia, serif;
  font-size: 1.35rem;
  font-weight: 400;
}

.formulario-login label {
  color: #505750;
  font-size: 0.82rem;
  font-weight: 700;
}

.formulario-login input {
  width: 100%;
  min-height: 2.5rem;
  padding: 0.55rem 0.7rem;
  border: 1px solid #c7c1b5;
  border-radius: 0.25rem;
  background: #fffdf8;
  color: #273b3a;
}

.formulario-login button {
  min-height: 2.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 700;
}

.formulario-login__enviar {
  margin-top: 0.4rem;
  border: 0;
  background: #31504b;
  color: #fffdf8;
}

.formulario-login__enviar:disabled {
  cursor: wait;
  opacity: 0.7;
}

.formulario-login__cambiar {
  border: 1px solid #d8d1c4;
  background: transparent;
  color: #31504b;
}

.formulario-login__error {
  margin: 0.2rem 0;
  color: #a33f32;
  font-size: 0.85rem;
}
</style>
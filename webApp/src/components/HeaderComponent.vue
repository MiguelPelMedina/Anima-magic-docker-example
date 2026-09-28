<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import LoginComponent from './LoginComponent.vue'
import { getAuthSession } from '../services/login'

const props = defineProps({
  vistaActiva: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['change-view', 'authenticated'])

const cuenta = ref(null)
const desplegado = ref(false)
const nick = ref(leerNick())

function leerNick() {
  try {
    return getAuthSession()?.usuario?.Nick ?? ''
  } catch {
    return ''
  }
}

function cerrarAlHacerClickFuera(event) {
  if (!cuenta.value?.contains(event.target)) desplegado.value = false
}

function cerrarConEscape(event) {
  if (event.key === 'Escape') desplegado.value = false
}

function alAutenticar(sesion) {
  nick.value = sesion.usuario.nick ?? sesion.usuario.Nick
  desplegado.value = false
  emit('authenticated', sesion)
}

onMounted(() => {
  document.addEventListener('click', cerrarAlHacerClickFuera)
  document.addEventListener('keydown', cerrarConEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', cerrarAlHacerClickFuera)
  document.removeEventListener('keydown', cerrarConEscape)
})
</script>

<template>
  <header class="encabezado-global">
    <div class="encabezado-global__contenido">
      <a class="encabezado-global__marca" href="/" aria-label="Anima Grimorio, inicio">
        <span class="encabezado-global__simbolo" aria-hidden="true">A</span>
        <span>Anima <span class="encabezado-global__separador">·</span> Grimorio</span>
      </a>
      <nav class="encabezado-global__vistas" role="tablist" aria-label="Vistas principales">
        <button
          class="encabezado-global__vista"
          :class="{ 'encabezado-global__vista--activa': props.vistaActiva === 'buscador' }"
          type="button"
          role="tab"
          :aria-selected="props.vistaActiva === 'buscador'"
          @click="emit('change-view', 'buscador')"
        >
          Buscador
        </button>
        <button
          class="encabezado-global__vista"
          :class="{ 'encabezado-global__vista--activa': props.vistaActiva === 'libros' }"
          type="button"
          role="tab"
          :aria-selected="props.vistaActiva === 'libros'"
          @click="emit('change-view', 'libros')"
        >
          Mis libros
        </button>
      </nav>
      <div ref="cuenta" class="encabezado-global__cuenta">
        <span v-if="nick" class="encabezado-global__bienvenida">Bienvenido, {{ nick }}</span>
        <button
          v-else
          class="encabezado-global__login"
          type="button"
          aria-controls="panel-login"
          :aria-expanded="desplegado"
          @click="desplegado = !desplegado"
        >
          Login
        </button>
        <div v-if="desplegado && !nick" id="panel-login" class="encabezado-global__panel">
          <LoginComponent @authenticated="alAutenticar" />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.encabezado-global {
  background: #273b3a;
  color: #fffdf8;
}

.encabezado-global__contenido {
  display: flex;
  position: relative;
  width: min(100% - 2rem, 62rem);
  min-height: 4.25rem;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.encabezado-global__vistas {
  display: flex;
  margin-left: auto;
  gap: 0.25rem;
}

.encabezado-global__marca {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  color: inherit;
  font-family: Georgia, serif;
  font-size: 1.1rem;
  text-decoration: none;
}

.encabezado-global__simbolo {
  display: grid;
  width: 2rem;
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid #c18a55;
  color: #e3b47e;
  font-size: 1rem;
}

.encabezado-global__separador {
  color: #e3b47e;
}

.encabezado-global__vista {
  min-height: 2.5rem;
  padding: 0.5rem 0.7rem;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: #fffdf8;
  cursor: pointer;
  font-size: 0.9rem;
}

.encabezado-global__vista:hover,
.encabezado-global__vista:focus-visible,
.encabezado-global__vista--activa {
  color: #e3b47e;
}

.encabezado-global__vista--activa {
  border-bottom-color: #e3b47e;
}

.encabezado-global__cuenta {
  position: relative;
}

.encabezado-global__login {
  min-height: 2.35rem;
  padding: 0.45rem 0.9rem;
  border: 1px solid #c18a55;
  border-radius: 0.25rem;
  background: transparent;
  color: #fffdf8;
  cursor: pointer;
  font-weight: 700;
}

.encabezado-global__login:hover,
.encabezado-global__login:focus-visible {
  background: #c18a55;
  color: #273b3a;
}

.encabezado-global__bienvenida {
  color: #e3b47e;
  font-size: 0.9rem;
}

.encabezado-global__panel {
  position: absolute;
  z-index: 2;
  top: calc(100% + 0.65rem);
  right: 0;
  width: min(20rem, calc(100vw - 2rem));
  padding: 1.15rem;
  border: 1px solid #d8d1c4;
  border-radius: 0.35rem;
  background: #fffdf8;
  box-shadow: 0 0.7rem 1.8rem rgba(39, 59, 58, 0.2);
}

.encabezado-global a:focus-visible,
.encabezado-global__vista:focus-visible {
  outline: 2px solid #e3b47e;
  outline-offset: 4px;
}

.encabezado-global__login:focus-visible {
  outline: 2px solid #e3b47e;
  outline-offset: 4px;
}

@media (max-width: 480px) {
  .encabezado-global__contenido {
    flex-wrap: wrap;
    gap: 0.65rem;
    padding: 0.65rem 0 0;
  }

  .encabezado-global__marca {
    gap: 0.45rem;
    font-size: 0.95rem;
  }

  .encabezado-global__bienvenida {
    max-width: 8rem;
    text-align: right;
  }

  .encabezado-global__vistas {
    width: 100%;
    margin-left: 0;
  }

  .encabezado-global__vista {
    flex: 1;
  }
}
</style>
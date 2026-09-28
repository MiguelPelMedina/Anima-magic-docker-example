<script setup>
import { ref, watch } from 'vue'
import LibroUsuario from './LibroUsuario.vue'
import { getUsuarioById } from '../services/usuarios'

const props = defineProps({
  usuarioId: {
    type: String,
    default: '',
  },
})

const libros = ref([])
const libroActivo = ref(0)
const tabButtons = ref([])
const cargando = ref(false)
const error = ref('')
let requestId = 0

watch(() => props.usuarioId, cargarLibros, { immediate: true })

async function cargarLibros(usuarioId) {
  const currentRequestId = ++requestId
  libros.value = []
  libroActivo.value = 0
  error.value = ''

  if (!usuarioId) {
    cargando.value = false
    return
  }

  cargando.value = true
  try {
    const usuario = await getUsuarioById(usuarioId)
    if (currentRequestId === requestId) libros.value = usuario.librosHechizos
  } catch (requestError) {
    if (currentRequestId === requestId) {
      error.value = requestError.message || 'No se pudieron cargar tus libros.'
    }
  } finally {
    if (currentRequestId === requestId) cargando.value = false
  }
}

function seleccionarTab(index, event) {
  libroActivo.value = index
  if (event.key === 'ArrowRight') {
    libroActivo.value = (index + 1) % libros.value.length
  } else if (event.key === 'ArrowLeft') {
    libroActivo.value = (index - 1 + libros.value.length) % libros.value.length
  } else if (event.key === 'Home') {
    libroActivo.value = 0
  } else if (event.key === 'End') {
    libroActivo.value = libros.value.length - 1
  } else {
    return
  }

  event.preventDefault()
  tabButtons.value[libroActivo.value]?.focus()
}
</script>

<template>
  <main id="mis-libros" class="pagina">
    <header class="cabecera">
      <p class="cabecera__eyebrow">Tu colección</p>
      <h1>Libros de hechizos</h1>
      <p class="cabecera__intro">Consulta los hechizos guardados en cada libro.</p>
    </header>

    <p v-if="!usuarioId" class="estado">Inicia sesión para consultar tus libros de hechizos.</p>
    <p v-else-if="cargando" class="estado" role="status">Cargando tus libros...</p>
    <p v-else-if="error" class="estado estado--error" role="alert">{{ error }}</p>
    <p v-else-if="!libros.length" class="estado">Todavía no tienes libros de hechizos.</p>

    <template v-else>
      <div class="libros-tabs" role="tablist" aria-label="Libros de hechizos">
        <button
          v-for="(libro, index) in libros"
          :id="`libro-tab-${index}`"
          :key="libro.id || `${libro.nombre}-${index}`"
          :ref="(element) => { tabButtons[index] = element }"
          class="libros-tabs__tab"
          :class="{ 'libros-tabs__tab--activo': libroActivo === index }"
          type="button"
          role="tab"
          :aria-selected="libroActivo === index"
          :aria-controls="`libro-panel-${index}`"
          :tabindex="libroActivo === index ? 0 : -1"
          @click="libroActivo = index"
          @keydown="seleccionarTab(index, $event)"
        >
          {{ libro.nombre || `Libro ${index + 1}` }}
        </button>
      </div>

      <div
        :id="`libro-panel-${libroActivo}`"
        class="libros-tabs__panel"
        role="tabpanel"
        :aria-labelledby="`libro-tab-${libroActivo}`"
        tabindex="0"
      >
        <LibroUsuario :libro="libros[libroActivo]" />
      </div>
    </template>
  </main>
</template>

<style scoped>
.libros-tabs {
  display: flex;
  gap: 0.35rem;
  overflow-x: auto;
  border-bottom: 1px solid #c7c1b5;
}

.libros-tabs__tab {
  flex: 0 0 auto;
  min-height: 2.75rem;
  padding: 0.65rem 1rem;
  border: 0;
  border-bottom: 3px solid transparent;
  background: transparent;
  color: #505750;
  cursor: pointer;
  font-weight: 700;
  white-space: nowrap;
}

.libros-tabs__tab:hover,
.libros-tabs__tab--activo {
  color: #273b3a;
}

.libros-tabs__tab--activo {
  border-bottom-color: #9b5d31;
}

.libros-tabs__tab:focus-visible,
.libros-tabs__panel:focus-visible {
  outline: 2px solid #31504b;
  outline-offset: 2px;
}

.libros-tabs__panel {
  padding-top: 1.5rem;
}
</style>
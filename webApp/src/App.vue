<script setup>
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import HechizoComponent from './components/HechizoComponent.vue'
import { getHechizos } from './services/hechizos'

const filtros = reactive({
  via: '',
  nivel: '',
  tipo: '',
})
const hechizos = ref([])
const cargando = ref(false)
const error = ref('')
const pagina = ref(1)
const totalPaginas = ref(1)
const sentinel = ref(null)
let observer
let requestId = 0

const cargarHechizos = async ({ reiniciar = false } = {}) => {
  if (cargando.value || (!reiniciar && pagina.value > totalPaginas.value)) return

  const currentRequestId = ++requestId
  cargando.value = true
  error.value = ''

  if (reiniciar) {
    pagina.value = 1
    totalPaginas.value = 1
    hechizos.value = []
  }

  try {
    const respuesta = await getHechizos({
      page: pagina.value,
      via: filtros.via.trim() || undefined,
      nivel: filtros.nivel || undefined,
      tipo: filtros.tipo
        .split(',')
        .map((tipo) => tipo.trim())
        .filter(Boolean),
    })

    if (currentRequestId !== requestId) return

    hechizos.value = reiniciar
      ? respuesta.hechizos
      : [...hechizos.value, ...respuesta.hechizos]
    totalPaginas.value = respuesta.totalPaginas
    pagina.value += 1
  } catch (requestError) {
    if (currentRequestId === requestId) {
      error.value = requestError.message || 'No se pudieron cargar los hechizos.'
    }
  } finally {
    if (currentRequestId === requestId) cargando.value = false
  }
}

const observarScroll = () => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) cargarHechizos()
    },
    { rootMargin: '240px' },
  )
  if (sentinel.value) observer.observe(sentinel.value)
}

watch(filtros, () => cargarHechizos({ reiniciar: true }))

onMounted(() => {
  cargarHechizos({ reiniciar: true })
  observarScroll()
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <main class="pagina">
    <header class="cabecera">
      <p class="cabecera__eyebrow">Anima · Grimorio</p>
      <h1>Biblioteca de hechizos</h1>
      <p class="cabecera__intro">Explora los sortilegios y sus distintos grados de poder.</p>
    </header>

    <form class="filtros" @submit.prevent="cargarHechizos({ reiniciar: true })">
      <label>
        Vía
        <input v-model="filtros.via" type="search" placeholder="Ej. Caos" />
      </label>
      <label>
        Nivel
        <input v-model="filtros.nivel" type="number" min="0" placeholder="Cualquier nivel" />
      </label>
      <label>
        Tipo
        <input v-model="filtros.tipo" type="search" placeholder="Ej. Efecto, Ataque" />
      </label>
      <button type="submit">Buscar</button>
    </form>

    <section class="resultados" aria-live="polite">
      <p v-if="!cargando && !error && !hechizos.length" class="estado">No se encontraron hechizos.</p>
      <p v-if="error" class="estado estado--error">{{ error }}</p>
      <HechizoComponent v-for="hechizo in hechizos" :key="hechizo.id" :hechizo="hechizo" />
      <p v-if="cargando" class="estado">Consultando el grimorio...</p>
      <div ref="sentinel" class="sentinel" aria-hidden="true"></div>
    </section>
  </main>
</template>

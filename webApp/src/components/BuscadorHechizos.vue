<script setup>
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import HechizoComponent from './HechizoComponent.vue'
import { getHechizos } from '../services/hechizos'
import {
  agregarHechizoALibro,
  crearLibroHechizo,
  listarLibrosHechizos,
} from '../services/usuarios'
import { getAuthSession } from '../services/login'
import { LibroHechizo } from '../models/usuario'

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
const usuarioId = ref('')
const libros = ref([])
const menuHechizoId = ref('')
const formularioNuevoLibro = ref(false)
const nombreNuevoLibro = ref('')
const cargandoLibros = ref(false)
const guardando = ref(false)
const errorAccion = ref('')
const exitoAccion = ref('')
let observer
let requestId = 0
let booksRequestId = 0

function leerUsuarioId() {
  try {
    const usuario = getAuthSession()?.usuario
    return usuario?.id ?? usuario?._id ?? ''
  } catch {
    return ''
  }
}

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

async function abrirMenuAñadir(hechizo) {
  if (menuHechizoId.value === hechizo.id) {
    menuHechizoId.value = ''
    return
  }

  menuHechizoId.value = hechizo.id
  formularioNuevoLibro.value = false
  nombreNuevoLibro.value = ''
  errorAccion.value = ''
  exitoAccion.value = ''
  usuarioId.value = leerUsuarioId()

  if (!usuarioId.value) {
    libros.value = []
    return
  }

  const currentRequestId = ++booksRequestId
  cargandoLibros.value = true
  try {
    const librosUsuario = await listarLibrosHechizos(usuarioId.value)
    if (currentRequestId === booksRequestId) libros.value = librosUsuario
  } catch (requestError) {
    if (currentRequestId === booksRequestId) {
      errorAccion.value = requestError.message || 'No se pudieron cargar tus libros.'
    }
  } finally {
    if (currentRequestId === booksRequestId) cargandoLibros.value = false
  }
}

function actualizarLibroLocal(libroId, hechizo) {
  const libro = libros.value.find((item) => item.id === libroId)
  if (libro && !libro.hechizos.some((item) => item.id === hechizo.id)) {
    libro.hechizos.push(hechizo)
  }
}

async function añadirAUnLibro(libro, hechizo) {
  if (guardando.value || !usuarioId.value || !libro.id) return

  guardando.value = true
  errorAccion.value = ''
  exitoAccion.value = ''
  try {
    await agregarHechizoALibro(usuarioId.value, libro.id, hechizo.id)
    actualizarLibroLocal(libro.id, hechizo)
    exitoAccion.value = `Añadido a ${libro.nombre}.`
  } catch (requestError) {
    errorAccion.value = requestError.message || 'No se pudo añadir el hechizo.'
  } finally {
    guardando.value = false
  }
}

function extraerLibroCreado(data) {
  const candidatos = [
    data?.libro,
    data?.LibroHechizo,
    data?.spellbook,
    data?.data?.libro,
    ...(Array.isArray(data?.LibrosHechizos) ? [data.LibrosHechizos.at(-1)] : []),
    ...(Array.isArray(data?.usuario?.LibrosHechizos)
      ? [data.usuario.LibrosHechizos.at(-1)]
      : []),
    data,
  ]
  const libro = candidatos.find((candidato) => candidato?.id || candidato?._id)
  return libro ? LibroHechizo.fromJSON(libro) : null
}

async function crearLibroYAñadir(hechizo) {
  const nombre = nombreNuevoLibro.value.trim()
  if (!nombre || guardando.value || !usuarioId.value) return

  guardando.value = true
  errorAccion.value = ''
  exitoAccion.value = ''
  const idsAnteriores = new Set(libros.value.map((libro) => libro.id).filter(Boolean))

  try {
    const respuesta = await crearLibroHechizo(usuarioId.value, {
      Nombre: nombre,
      Hechizos: [],
    })
    let libro = extraerLibroCreado(respuesta)

    if (!libro?.id) {
      libros.value = await listarLibrosHechizos(usuarioId.value)
      libro = [...libros.value].reverse().find((item) => (
        item.nombre === nombre && item.id && !idsAnteriores.has(item.id)
      ))
    } else if (!libros.value.some((item) => item.id === libro.id)) {
      libros.value.push(libro)
    }

    if (!libro?.id) {
      throw new Error('El libro se creó, pero no se pudo obtener su identificador para añadir el hechizo.')
    }

    await agregarHechizoALibro(usuarioId.value, libro.id, hechizo.id)
    actualizarLibroLocal(libro.id, hechizo)
    exitoAccion.value = `Libro ${nombre} creado y hechizo añadido.`
    nombreNuevoLibro.value = ''
    formularioNuevoLibro.value = false
  } catch (requestError) {
    errorAccion.value = requestError.message || 'No se pudo crear el libro y añadir el hechizo.'
  } finally {
    guardando.value = false
  }
}

watch(filtros, () => cargarHechizos({ reiniciar: true }))

onMounted(() => {
  cargarHechizos({ reiniciar: true })
  observarScroll()
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <main id="biblioteca" class="pagina">
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
      <div v-for="hechizo in hechizos" :key="hechizo.id" class="hechizo-resultado">
        <HechizoComponent :hechizo="hechizo" />
        <div class="hechizo-resultado__acciones">
          <button
            class="hechizo-resultado__añadir"
            type="button"
            :aria-expanded="menuHechizoId === hechizo.id"
            :aria-controls="`menu-anadir-${hechizo.id}`"
            @click="abrirMenuAñadir(hechizo)"
          >
            Añadir
          </button>

          <div
            v-if="menuHechizoId === hechizo.id"
            :id="`menu-anadir-${hechizo.id}`"
            class="hechizo-resultado__menu"
          >
            <p v-if="!usuarioId" class="hechizo-resultado__aviso">
              Inicia sesión para guardar hechizos en tus libros.
            </p>
            <p v-else-if="cargandoLibros" class="hechizo-resultado__aviso" role="status">
              Cargando tus libros...
            </p>
            <p v-else-if="errorAccion" class="hechizo-resultado__error" role="alert">
              {{ errorAccion }}
            </p>

            <template v-else-if="usuarioId">
              <p v-if="!libros.length" class="hechizo-resultado__aviso">
                Aún no tienes libros de hechizos.
              </p>
              <div v-else class="hechizo-resultado__libros" aria-label="Libros disponibles">
                <button
                  v-for="libro in libros"
                  :key="libro.id || libro.nombre"
                  type="button"
                  :disabled="guardando || !libro.id"
                  @click="añadirAUnLibro(libro, hechizo)"
                >
                  {{ libro.nombre }}
                </button>
              </div>

              <button
                class="hechizo-resultado__nuevo"
                type="button"
                :aria-expanded="formularioNuevoLibro"
                @click="formularioNuevoLibro = !formularioNuevoLibro; errorAccion = ''; exitoAccion = ''"
              >
                Nuevo libro
              </button>

              <form
                v-if="formularioNuevoLibro"
                class="hechizo-resultado__formulario"
                @submit.prevent="crearLibroYAñadir(hechizo)"
              >
                <label :for="`nombre-libro-${hechizo.id}`">Nombre del libro</label>
                <input
                  :id="`nombre-libro-${hechizo.id}`"
                  v-model="nombreNuevoLibro"
                  type="text"
                  required
                  :disabled="guardando"
                />
                <button type="submit" :disabled="guardando || !nombreNuevoLibro.trim()">
                  {{ guardando ? 'Guardando...' : 'Crear y añadir' }}
                </button>
              </form>
              <p v-if="exitoAccion" class="hechizo-resultado__exito" role="status">
                {{ exitoAccion }}
              </p>
              <p v-if="errorAccion" class="hechizo-resultado__error" role="alert">
                {{ errorAccion }}
              </p>
            </template>
          </div>
        </div>
      </div>
      <p v-if="cargando" class="estado">Consultando el grimorio...</p>
      <div ref="sentinel" class="sentinel" aria-hidden="true"></div>
    </section>
  </main>
</template>

<style scoped>
.hechizo-resultado {
  min-width: 0;
}

.hechizo-resultado:not(:last-child) {
  padding-bottom: 1rem;
  border-bottom: 1px solid #d8d1c4;
}

.hechizo-resultado__acciones {
  position: relative;
  display: flex;
  justify-content: flex-end;
  margin-top: 0.75rem;
}

.hechizo-resultado__añadir,
.hechizo-resultado__formulario button {
  min-height: 2.4rem;
  padding: 0.5rem 1rem;
  border: 0;
  border-radius: 0.25rem;
  background: #31504b;
  color: #fffdf8;
  cursor: pointer;
  font-weight: 700;
}

.hechizo-resultado__menu {
  position: absolute;
  z-index: 2;
  top: calc(100% + 0.5rem);
  right: 0;
  width: min(20rem, calc(100vw - 2rem));
  max-height: min(70vh, 28rem);
  overflow-y: auto;
  padding: 1rem;
  border: 1px solid #d8d1c4;
  border-radius: 0.35rem;
  background: #fffdf8;
  box-shadow: 0 0.7rem 1.8rem rgba(39, 59, 58, 0.18);
}

.hechizo-resultado__libros {
  display: grid;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
}

.hechizo-resultado__libros button,
.hechizo-resultado__nuevo {
  width: 100%;
  min-height: 2.4rem;
  padding: 0.5rem 0.65rem;
  border: 1px solid #d8d1c4;
  border-radius: 0.25rem;
  background: transparent;
  color: #31504b;
  cursor: pointer;
  text-align: left;
}

.hechizo-resultado__nuevo {
  border-color: #31504b;
  font-weight: 700;
}

.hechizo-resultado__libros button:hover,
.hechizo-resultado__nuevo:hover {
  background: #e8e3d8;
}

.hechizo-resultado__libros button:disabled,
.hechizo-resultado__formulario button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.hechizo-resultado__formulario {
  display: grid;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.hechizo-resultado__formulario label {
  color: #505750;
  font-size: 0.82rem;
  font-weight: 700;
}

.hechizo-resultado__formulario input {
  width: 100%;
  min-height: 2.4rem;
  padding: 0.5rem 0.65rem;
  border: 1px solid #c7c1b5;
  border-radius: 0.25rem;
  background: #fffdf8;
  color: #273b3a;
}

.hechizo-resultado__aviso,
.hechizo-resultado__error,
.hechizo-resultado__exito {
  margin: 0.25rem 0 0.75rem;
  font-size: 0.88rem;
  line-height: 1.4;
}

.hechizo-resultado__aviso { color: #6f746d; }
.hechizo-resultado__error { color: #a33f32; }
.hechizo-resultado__exito { color: #31504b; }
</style>
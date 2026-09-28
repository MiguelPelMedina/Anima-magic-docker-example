<script setup>
import { ref } from 'vue'
import HeaderComponent from './components/HeaderComponent.vue'
import BuscadorHechizos from './components/BuscadorHechizos.vue'
import ListaLibrosUsuarios from './components/ListaLibrosUsuarios.vue'
import { getAuthSession } from './services/login'

const vistaActiva = ref('buscador')
const usuarioId = ref(leerUsuarioId())

function leerUsuarioId() {
  try {
    const usuario = getAuthSession()?.usuario
    return usuario?.id ?? usuario?._id ?? ''
  } catch {
    return ''
  }
}

function alAutenticar(sesion) {
  usuarioId.value = sesion.usuario.id ?? sesion.usuario._id ?? ''
}
</script>

<template>
  <HeaderComponent
    :vista-activa="vistaActiva"
    @change-view="vistaActiva = $event"
    @authenticated="alAutenticar"
  />
  <BuscadorHechizos v-if="vistaActiva === 'buscador'" />
  <ListaLibrosUsuarios v-else :usuario-id="usuarioId" />
</template>

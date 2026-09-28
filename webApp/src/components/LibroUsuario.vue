<script setup>
import { computed } from 'vue'
import HechizoComponent from './HechizoComponent.vue'

const props = defineProps({
  libro: {
    type: Object,
    required: true,
  },
})

const hechizosOrdenados = computed(() => (
  [...props.libro.hechizos].sort((a, b) => (a.nivel ?? 0) - (b.nivel ?? 0))
))
</script>

<template>
  <section class="libro-usuario">
    <h2>{{ libro.nombre }}</h2>
    <div v-if="hechizosOrdenados.length" class="libro-usuario__hechizos">
      <HechizoComponent
        v-for="(hechizo, index) in hechizosOrdenados"
        :key="hechizo.id || `${hechizo.nombre}-${index}`"
        :hechizo="hechizo"
      />
    </div>
    <p v-else class="estado">Este libro todavía no tiene hechizos.</p>
  </section>
</template>

<style scoped>
.libro-usuario h2 {
  margin: 0 0 1.25rem;
  color: #273b3a;
  font-family: Georgia, serif;
  font-size: 1.7rem;
  font-weight: 400;
}

.libro-usuario__hechizos {
  display: grid;
  gap: 1rem;
}
</style>
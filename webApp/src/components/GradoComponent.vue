<script setup>
defineProps({
  grado: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="grado">
    <div class="grado__header">
      <h3>{{ grado.name }}</h3>
      <span class="grado__coste">{{ grado.coste }} PC</span>
    </div>

    <dl class="grado__datos">
      <div>
        <dt>IntR</dt>
        <dd>{{ grado.intR }}</dd>
      </div>
      <div>
        <dt>Mantenimiento</dt>
        <dd>{{ grado.costeMantenimiento }}</dd>
      </div>
    </dl>

    <p class="grado__efecto">{{ grado.efecto }}</p>
  </article>
</template>

<style scoped>
.grado {
  padding: 1rem;
  border: 1px solid #d8d1c4;
  border-radius: 0.35rem;
  background: #fffdf8;
}

.grado__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

h3 {
  margin: 0;
  color: #273b3a;
  font-size: 1rem;
}

.grado__coste {
  color: #9b5d31;
  font-weight: 700;
  white-space: nowrap;
}

.grado__datos {
  display: flex;
  gap: 1.25rem;
  margin: 0.75rem 0;
}

.grado__datos div {
  display: flex;
  gap: 0.35rem;
}

dt {
  color: #6f746d;
}

dd {
  margin: 0;
  font-weight: 700;
}

.grado__efecto {
  margin: 0;
  color: #505750;
  line-height: 1.55;
}
</style>
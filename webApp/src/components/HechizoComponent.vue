<script setup>
import GradoComponent from './GradoComponent.vue'

const viaClasses = {
  'Libre Acceso': 'libre-acceso',
  Oscuridad: 'oscuridad',
  Nigromancia: 'nigromancia',
  Ilusión: 'ilusion',
  Esencia: 'esencia',
  Fuego: 'fuego',
  Vacío: 'vacio',
  Paz: 'paz',
  Literae: 'literae',
  Aire: 'aire',
  Conocimiento: 'conocimiento',
  Destrucción: 'destruccion',
  Luz: 'luz',
  Nobleza: 'nobleza',
  Tiempo: 'tiempo',
  Creación: 'creacion',
  Tierra: 'tierra',
  Muerte: 'muerte',
  Agua: 'agua',
  Sangre: 'sangre',
  Umbral: 'umbral',
  Sueños: 'suenos',
  Música: 'musica',
  Caos: 'caos',
  Guerra: 'guerra',
  Pecado: 'pecado',
}

function getViaClass(via) {
  return viaClasses[via] ?? 'desconocida'
}

defineProps({
  hechizo: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article :class="['hechizo', `hechizo--${getViaClass(hechizo.via)}`]">
    <header class="hechizo__header">
      <div>
        <p class="hechizo__via">{{ hechizo.via }}</p>
        <h2>{{ hechizo.nombre }}</h2>
      </div>
      <div class="hechizo__nivel">
        <span>Nivel</span>
        <strong>{{ hechizo.nivel }}</strong>
      </div>
    </header>

    <table class="hechizo__tabla">
      <thead>
        <tr>
          <th scope="col">Tipo</th>
          <th scope="col">Mantenimiento</th>
          <th scope="col">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ hechizo.tipo.join(', ') }}</td>
          <td>{{ hechizo.mantenimiento }}</td>
          <td>{{ hechizo.accion }}</td>
        </tr>
      </tbody>
    </table>

    <p class="hechizo__efecto">{{ hechizo.efecto }}</p>

    <section v-if="hechizo.grado.length" class="hechizo__grados">
      <h3>Grados</h3>
      <div class="hechizo__grados-lista">
        <GradoComponent
          v-for="grado in hechizo.grado"
          :key="grado.name"
          :grado="grado"
        />
      </div>
    </section>
  </article>
</template>

<style scoped>
.hechizo {
  padding: clamp(1.2rem, 3vw, 2rem);
  border: 3px solid transparent;
  border-radius: 0.45rem;
  background:
    linear-gradient(rgba(255, 253, 248, 0.96), rgba(255, 253, 248, 0.96)) padding-box,
    linear-gradient(135deg, var(--via-start), var(--via-end)) border-box;
  box-shadow: 0 0.5rem 1.5rem rgba(39, 59, 58, 0.06);
}

.hechizo--libre-acceso { --via-start: #64748b; --via-end: #cbd5e1; }
.hechizo--oscuridad { --via-start: #17132b; --via-end: #6d28d9; }
.hechizo--nigromancia { --via-start: #374151; --via-end: #84cc16; }
.hechizo--ilusion { --via-start: #be185d; --via-end: #f9a8d4; }
.hechizo--esencia { --via-start: #0f766e; --via-end: #99f6e4; }
.hechizo--fuego { --via-start: #b91c1c; --via-end: #f59e0b; }
.hechizo--vacio { --via-start: #111827; --via-end: #38bdf8; }
.hechizo--paz { --via-start: #15803d; --via-end: #bbf7d0; }
.hechizo--literae { --via-start: #1d4ed8; --via-end: #93c5fd; }
.hechizo--aire { --via-start: #0891b2; --via-end: #bae6fd; }
.hechizo--conocimiento { --via-start: #4338ca; --via-end: #c4b5fd; }
.hechizo--destruccion { --via-start: #7f1d1d; --via-end: #fb7185; }
.hechizo--luz { --via-start: #ca8a04; --via-end: #fef08a; }
.hechizo--nobleza { --via-start: #9f1239; --via-end: #fda4af; }
.hechizo--tiempo { --via-start: #92400e; --via-end: #fcd34d; }
.hechizo--creacion { --via-start: #047857; --via-end: #a7f3d0; }
.hechizo--tierra { --via-start: #78350f; --via-end: #d6a56d; }
.hechizo--muerte { --via-start: #1f2937; --via-end: #9ca3af; }
.hechizo--agua { --via-start: #0369a1; --via-end: #67e8f9; }
.hechizo--sangre { --via-start: #991b1b; --via-end: #fca5a5; }
.hechizo--umbral { --via-start: #4c1d95; --via-end: #f0abfc; }
.hechizo--suenos { --via-start: #7e22ce; --via-end: #f9a8d4; }
.hechizo--musica { --via-start: #0e7490; --via-end: #f0abfc; }
.hechizo--caos { --via-start: #581c87; --via-end: #f97316; }
.hechizo--guerra { --via-start: #7f1d1d; --via-end: #94a3b8; }
.hechizo--pecado { --via-start: #450a0a; --via-end: #be123c; }
.hechizo--desconocida { --via-start: #78716c; --via-end: #d6d3d1; }

.hechizo__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.hechizo__via {
  margin: 0 0 0.35rem;
  color: #9b5d31;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hechizo__nivel {
  display: grid;
  justify-items: end;
  color: #9b5d31;
  line-height: 1;
  text-transform: uppercase;
}

.hechizo__nivel span {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.hechizo__nivel strong {
  font-family: Georgia, serif;
  font-size: clamp(2rem, 5.5vw, 3.2rem);
  font-weight: 400;
}

h2 {
  margin: 0;
  color: #273b3a;
  font-family: Georgia, serif;
  font-size: clamp(1.35rem, 3vw, 1.8rem);
}

.hechizo__tabla {
  width: 100%;
  margin-top: 1.25rem;
  border-collapse: collapse;
  color: #414943;
  font-size: 0.88rem;
  table-layout: fixed;
}

.hechizo__tabla th {
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid #bdb6a9;
  color: #6f746d;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-align: left;
  text-transform: uppercase;
}

.hechizo__tabla td {
  padding: 0.75rem;
  border-bottom: 1px solid #d8d1c4;
  font-weight: 700;
}

.hechizo__efecto {
  margin: 1.25rem 0;
  color: #414943;
  line-height: 1.65;
}

.hechizo__grados h3 {
  margin: 0 0 0.75rem;
  color: #273b3a;
  font-size: 1rem;
}

.hechizo__grados {
  padding-top: 1.25rem;
  border-top: 1px solid #d8d1c4;
}

.hechizo__grados-lista {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

@media (max-width: 520px) {
  .hechizo__header {
    flex-direction: column;
  }

  .hechizo__nivel {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .hechizo__grados-lista {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
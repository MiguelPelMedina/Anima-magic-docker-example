export class GradoHechizo {
  constructor({
    name,
    coste,
    intR,
    efecto,
    costeMantenimiento,
  } = {}) {
    this.name = name ?? ''
    this.coste = coste ?? 0
    this.intR = intR ?? 0
    this.efecto = efecto ?? ''
    this.costeMantenimiento = costeMantenimiento ?? 0
  }

  static fromJSON(data = {}) {
    return new GradoHechizo({
      name: data.Name,
      coste: data.Coste,
      intR: data.IntR,
      efecto: data.Efecto,
      costeMantenimiento: data.CosteMantenimiento,
    })
  }
}

export class Hechizo {
  constructor({
    id,
    nombre,
    nivel,
    via,
    accion,
    efecto,
    tipo,
    mantenimiento,
    grado,
  } = {}) {
    this.id = id ?? ''
    this.nombre = nombre ?? ''
    this.nivel = nivel ?? 0
    this.via = via ?? ''
    this.accion = accion ?? ''
    this.efecto = efecto ?? ''
    this.tipo = tipo ?? []
    this.mantenimiento = mantenimiento ?? ''
    this.grado = grado ?? []
  }

  static fromJSON(data = {}) {
    return new Hechizo({
      id: data._id,
      nombre: data.Nombre,
      nivel: data.Nivel,
      via: data.Via,
      accion: data.Accion,
      efecto: data.Efecto,
      tipo: Array.isArray(data.Tipo) ? data.Tipo : [],
      mantenimiento: data.mantenimiento,
      grado: Array.isArray(data.Grado)
        ? data.Grado.map((grado) => GradoHechizo.fromJSON(grado))
        : [],
    })
  }
}

export class HechizosResponse {
  constructor({ total, page, totalPaginas, resultados, hechizos } = {}) {
    this.total = total ?? 0
    this.page = page ?? 1
    this.totalPaginas = totalPaginas ?? 0
    this.resultados = resultados ?? 0
    this.hechizos = hechizos ?? []
  }

  static fromJSON(data = {}) {
    return new HechizosResponse({
      total: data.total,
      page: data.page,
      totalPaginas: data.totalPaginas,
      resultados: data.resultados,
      hechizos: Array.isArray(data.hechizos)
        ? data.hechizos.map((hechizo) => Hechizo.fromJSON(hechizo))
        : [],
    })
  }
}
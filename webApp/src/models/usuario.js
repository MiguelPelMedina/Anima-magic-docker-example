import { Hechizo } from './hechizo'

export class LibroHechizo {
  constructor({ id, nombre, hechizos } = {}) {
    this.id = id ?? ''
    this.nombre = nombre ?? ''
    this.hechizos = hechizos ?? []
  }

  static fromJSON(data = {}) {
    return new LibroHechizo({
      id: data.id ?? data._id,
      nombre: data.Nombre ?? data.nombre,
      hechizos: Array.isArray(data.Hechizos ?? data.hechizos)
        ? (data.Hechizos ?? data.hechizos).map((hechizo) => Hechizo.fromJSON(hechizo))
        : [],
    })
  }
}

export class Usuario {
  constructor({ id, nick, librosHechizos } = {}) {
    this.id = id ?? ''
    this.nick = nick ?? ''
    this.librosHechizos = librosHechizos ?? []
  }

  static fromJSON(data = {}) {
    const usuario = data.usuario ?? data
    const libros = usuario.LibrosHechizos ?? usuario.librosHechizos

    return new Usuario({
      id: usuario.id ?? usuario._id,
      nick: usuario.Nick ?? usuario.nick,
      librosHechizos: Array.isArray(libros)
        ? libros.map((libro) => LibroHechizo.fromJSON(libro))
        : [],
    })
  }
}
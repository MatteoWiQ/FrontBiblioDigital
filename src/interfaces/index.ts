
export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  descripcion: string;
  url_pdf: string;
  categoria: string;
  precio: number;
}

export interface Usuario {
  id: number;
  email: string;
  rol: string;
}
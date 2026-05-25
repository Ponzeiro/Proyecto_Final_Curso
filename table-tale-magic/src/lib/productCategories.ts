import { CategoriaProducto } from "@/types/restaurant";

export const PRIMER_PLATO = "1º plato" as CategoriaProducto;
export const SEGUNDO_PLATO = "2º plato" as CategoriaProducto;
export const POSTRES = "Postres" as CategoriaProducto;
export const MENU_DEL_DIA = "Menú del día" as CategoriaProducto;
export const CAFES = "Cafés" as CategoriaProducto;

const limpiarCategoria = (categoria: string) =>
  categoria
    .trim()
    .replaceAll("Â", "")
    .replaceAll("°", "º")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const normalizeCategoriaProducto = (categoria: string): CategoriaProducto => {
  const limpia = limpiarCategoria(categoria);

  if (limpia.includes("postre")) return POSTRES;
  if (limpia.includes("menu")) return MENU_DEL_DIA;
  if (limpia.includes("cafe")) return CAFES;
  if (limpia.includes("refresco")) return "Refrescos";
  if (limpia.includes("agua")) return "Agua";
  if (limpia.includes("cerveza")) return "Cerveza";
  if (limpia.includes("vermouth")) return "Vermouth";

  if (limpia.startsWith("1") || limpia.includes("primer") || limpia.includes("primero")) {
    return PRIMER_PLATO;
  }

  if (limpia.startsWith("2") || limpia.includes("segund")) {
    return SEGUNDO_PLATO;
  }

  return categoria.trim() as CategoriaProducto;
};

export type Rol = "admin" | "camarero";

export interface Empleado {
  id: number;
  nombre: string;
  rol: Rol;
  pinAcceso: string;
}

export type EstadoMesa = "Libre" | "Ocupado";

export interface Mesa {
  id: number;
  numeroMesa: number;
  estado: EstadoMesa;
  capacidad: number;
  zona: "bar" | "comedor";
}

export type EstadoComanda = "Abierta" | "Pagada";

export interface Comanda {
  id: number;
  idMesa: number;
  idEmpleado: number;
  estado: EstadoComanda;
  fecha: string;
  total: number;
}

export type CategoriaProducto =
  | "Bebidas"
  | "Refrescos"
  | "Agua"
  | "Cerveza"
  | "Vermouth"
  | "Menú del día"
  | "1º plato"
  | "2º plato"
  | "Menús"
  | "Postres"
  | "Cafés";

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: CategoriaProducto;
  cantidad: number;
  imagen?: string; // URL de la foto del producto (opcional)
}

export interface LineaComanda {
  id: number;
  idComanda: number;
  idProducto: number;
  cantidad: number;
  subtotal: number;
}

export type MetodoPago = "efectivo" | "tarjeta" | "tarjeta_info_bar";

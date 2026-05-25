import React, { createContext, useEffect, useState, useCallback } from "react";
import {
  Empleado, Mesa, Comanda, LineaComanda, EstadoMesa, MetodoPago, Producto,
} from "@/types/restaurant";
import {
  empleados, mesasIniciales, productos,
} from "@/data/mockData";
import { apiRequest } from "@/lib/api";

export interface RestaurantContextType {
  empleadoActual: Empleado | null;
  mesas: Mesa[];
  comandas: Comanda[];
  lineasComandas: LineaComanda[];
  productosDinamicos: Producto[];
  setProductosDinamicos: (p: Producto[]) => void;
  login: (pin: string) => boolean;
  logout: () => void;
  abrirComanda: (idMesa: number) => Comanda;
  getComandaAbierta: (idMesa: number) => Comanda | undefined;
  getLineasDeComanda: (idComanda: number) => LineaComanda[];
  agregarProducto: (idComanda: number, idProducto: number) => void;
  editarCantidadLinea: (idLinea: number, nuevaCantidad: number) => void;
  eliminarLinea: (idLinea: number) => void;
  pagarComanda: (idComanda: number, metodo: MetodoPago) => void;
  actualizarEstadoMesa: (idMesa: number, estado: EstadoMesa) => void;
}

type RestaurantContextGlobal = typeof globalThis & {
  __restaurantContext__?: React.Context<RestaurantContextType | null>;
};

const restaurantContextGlobal = globalThis as RestaurantContextGlobal;

export const RestaurantContext =
  restaurantContextGlobal.__restaurantContext__ ??
  createContext<RestaurantContextType | null>(null);

restaurantContextGlobal.__restaurantContext__ = RestaurantContext;
RestaurantContext.displayName = "RestaurantContext";

let nextComandaId = 100;
let nextLineaId = 100;

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [empleadoActual, setEmpleadoActual] = useState<Empleado | null>(() => {
    const empleadoGuardado = sessionStorage.getItem("empleadoActual");
    if (!empleadoGuardado) return null;
    const idEmpleado = Number(empleadoGuardado);
    return empleados.find((e) => e.id === idEmpleado) ?? null;
  });
  const [mesas, setMesas] = useState<Mesa[]>(mesasIniciales);
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [lineasComandas, setLineasComandas] = useState<LineaComanda[]>([]);
  const [productosDinamicos, setProductosDinamicos] = useState<Producto[]>([]);

  const sincronizarComandas = useCallback(async () => {
    try {
      const [comandasDB, lineasDB] = await Promise.all([
        apiRequest<Comanda[]>("/comandas"),
        apiRequest<LineaComanda[]>("/lineas-comandas"),
      ]);
      const abiertas = comandasDB.filter((c) => c.estado === "Abierta");
      const idsAbiertas = new Set(abiertas.map((c) => c.id));
      const lineasAbiertas = lineasDB.filter((l) => idsAbiertas.has(l.idComanda));
      nextComandaId = Math.max(nextComandaId, ...abiertas.map((c) => c.id + 1), 100);
      nextLineaId = Math.max(nextLineaId, ...lineasAbiertas.map((l) => l.id + 1), 100);
      setComandas(abiertas);
      setLineasComandas(lineasAbiertas);
      setMesas((prev) =>
        prev.map((m) => ({
          ...m,
          estado: abiertas.some((c) => c.idMesa === m.id) ? "Ocupado" : "Libre",
        }))
      );
    } catch (error) {
      console.error("No se pudieron cargar las comandas", error);
    }
  }, []);

  useEffect(() => {
    sincronizarComandas();
  }, [sincronizarComandas]);

  const findProducto = useCallback(
    (id: number) =>
      productosDinamicos.find((p) => p.id === id) ??
      productos.find((p) => p.id === id),
    [productosDinamicos]
  );

  const login = useCallback((pin: string): boolean => {
    const emp = empleados.find((e) => e.pinAcceso === pin);
    if (emp) {
      sessionStorage.setItem("empleadoActual", String(emp.id));
      setEmpleadoActual(emp);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("empleadoActual");
    setEmpleadoActual(null);
  }, []);

  const actualizarEstadoMesa = useCallback((idMesa: number, estado: EstadoMesa) => {
    setMesas((prev) => prev.map((m) => (m.id === idMesa ? { ...m, estado } : m)));
  }, []);

  const abrirComanda = useCallback((idMesa: number): Comanda => {
    const nueva: Comanda = {
      id: nextComandaId++,
      idMesa,
      idEmpleado: empleadoActual?.id ?? 0,
      estado: "Abierta",
      fecha: new Date().toISOString(),
      total: 0,
    };
    setComandas((prev) => [...prev, nueva]);
    actualizarEstadoMesa(idMesa, "Ocupado");
    apiRequest<Comanda>("/comandas", {
      method: "POST",
      body: JSON.stringify({
        id: nueva.id,
        idMesa,
        idEmpleado: empleadoActual?.id ?? 1,
        estado: "Abierta",
        fecha: nueva.fecha,
        total: 0,
      }),
    })
      .then((guardada) => {
        setComandas((prev) => prev.map((c) => (c.id === nueva.id ? guardada : c)));
      })
      .catch((error) => console.error("No se pudo guardar la comanda", error));
    return nueva;
  }, [empleadoActual, actualizarEstadoMesa]);

  const getComandaAbierta = useCallback(
    (idMesa: number) => comandas.find((c) => c.idMesa === idMesa && c.estado === "Abierta"),
    [comandas]
  );

  const getLineasDeComanda = useCallback(
    (idComanda: number) => lineasComandas.filter((l) => l.idComanda === idComanda),
    [lineasComandas]
  );

  const recalcularTotal = useCallback((idComanda: number, lineas: LineaComanda[]) => {
    const total = lineas.filter((l) => l.idComanda === idComanda).reduce((sum, l) => sum + l.subtotal, 0);
    setComandas((prev) => prev.map((c) => (c.id === idComanda ? { ...c, total } : c)));
  }, []);

  const agregarProducto = useCallback((idComanda: number, idProducto: number) => {
    const prod = findProducto(idProducto);
    if (!prod) return;

    setLineasComandas((prev) => {
      const existente = prev.find((l) => l.idComanda === idComanda && l.idProducto === idProducto);
      let updated: LineaComanda[];
      if (existente) {
        updated = prev.map((l) =>
          l.id === existente.id
            ? { ...l, cantidad: l.cantidad + 1, subtotal: (l.cantidad + 1) * prod.precio }
            : l
        );
      } else {
        const nueva: LineaComanda = {
          id: nextLineaId++,
          idComanda,
          idProducto,
          cantidad: 1,
          subtotal: prod.precio,
        };
        updated = [...prev, nueva];
      }
      setTimeout(() => recalcularTotal(idComanda, updated), 0);
      const linea = updated.find((l) => l.idComanda === idComanda && l.idProducto === idProducto);
      if (linea) {
        const method = existente ? "PUT" : "POST";
        const path = existente ? `/lineas-comandas/${linea.id}` : "/lineas-comandas";
        apiRequest<LineaComanda>(path, {
          method,
          body: JSON.stringify(linea),
        })
          .then((guardada) => {
            if (!existente) {
              setLineasComandas((actuales) =>
                actuales.map((l) => (l.id === linea.id ? guardada : l))
              );
            }
          })
          .catch((error) => console.error("No se pudo guardar la linea", error));
      }
      return updated;
    });
  }, [recalcularTotal, findProducto]);

  const editarCantidadLinea = useCallback((idLinea: number, nuevaCantidad: number) => {
    setLineasComandas((prev) => {
      const linea = prev.find((l) => l.id === idLinea);
      if (!linea) return prev;
      const prod = findProducto(linea.idProducto);
      if (!prod) return prev;
      const updated = prev.map((l) =>
        l.id === idLinea ? { ...l, cantidad: nuevaCantidad, subtotal: nuevaCantidad * prod.precio } : l
      );
      setTimeout(() => recalcularTotal(linea.idComanda, updated), 0);
      const actualizada = updated.find((l) => l.id === idLinea);
      if (actualizada) {
        apiRequest<LineaComanda>(`/lineas-comandas/${idLinea}`, {
          method: "PUT",
          body: JSON.stringify(actualizada),
        }).catch((error) => console.error("No se pudo actualizar la linea", error));
      }
      return updated;
    });
  }, [recalcularTotal, findProducto]);

  const eliminarLinea = useCallback((idLinea: number) => {
    setLineasComandas((prev) => {
      const linea = prev.find((l) => l.id === idLinea);
      if (!linea) return prev;
      const updated = prev.filter((l) => l.id !== idLinea);
      setTimeout(() => recalcularTotal(linea.idComanda, updated), 0);
      apiRequest<void>(`/lineas-comandas/${idLinea}`, { method: "DELETE" })
        .catch((error) => console.error("No se pudo eliminar la linea", error));
      return updated;
    });
  }, [recalcularTotal]);

  const pagarComanda = useCallback((idComanda: number, _metodo: MetodoPago) => {
    const comanda = comandas.find((c) => c.id === idComanda);
    if (!comanda) return;
    setComandas((prev) => prev.map((c) => (c.id === idComanda ? { ...c, estado: "Pagada" } : c)));
    actualizarEstadoMesa(comanda.idMesa, "Libre");
    setLineasComandas((prev) => prev.filter((l) => l.idComanda !== idComanda));
    apiRequest<Comanda>(`/comandas/${idComanda}/pagar`, { method: "POST" })
      .catch((error) => console.error("No se pudo pagar la comanda", error));
  }, [comandas, actualizarEstadoMesa]);

  return (
    <RestaurantContext.Provider
      value={{
        empleadoActual, mesas, comandas, lineasComandas,
        productosDinamicos, setProductosDinamicos,
        login, logout, abrirComanda, getComandaAbierta, getLineasDeComanda,
        agregarProducto, editarCantidadLinea, eliminarLinea, pagarComanda, actualizarEstadoMesa,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};


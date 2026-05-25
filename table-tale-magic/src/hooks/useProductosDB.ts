import { useEffect, useState, useCallback } from "react";
import { CategoriaProducto, Producto } from "@/types/restaurant";
import { API_URL } from "@/lib/api";
import { normalizeCategoriaProducto } from "@/lib/productCategories";

const PRODUCTOS_CHANGED_EVENT = "productos-db-changed";

export interface ProductoDB {
  id: string; // uuid
  nombre: string;
  precio: number;
  categoria: string;
}

// Convierte el uuid a un id numérico estable (>= 1_000_000 para no chocar con los estáticos)
const uuidToNumericId = (uuid: string): number => {
  let h = 0;
  for (let i = 0; i < uuid.length; i++) {
    h = (h * 31 + uuid.charCodeAt(i)) | 0;
  }
  return 1_000_000 + Math.abs(h);
};

export const productoDBToProducto = (p: ProductoDB): Producto => ({
  id: uuidToNumericId(p.id),
  nombre: p.nombre,
  precio: Number(p.precio),
  categoria: normalizeCategoriaProducto(p.categoria),
  cantidad: 100,
});

export const useProductosDB = () => {
  const [productos, setProductos] = useState<ProductoDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/productos`);
      if (!response.ok) throw new Error("No se pudieron cargar los productos");
      const data = await response.json();
      setProductos(data as ProductoDB[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los platos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    const recargarProductos = () => {
      cargar();
    };
    window.addEventListener(PRODUCTOS_CHANGED_EVENT, recargarProductos);
    return () => window.removeEventListener(PRODUCTOS_CHANGED_EVENT, recargarProductos);
  }, [cargar]);

  const notificarCambios = useCallback(() => {
    window.dispatchEvent(new Event(PRODUCTOS_CHANGED_EVENT));
  }, []);

  const crear = useCallback(
    async (nombre: string, precio: number, categoria: string) => {
      setError(null);
      try {
        const response = await fetch(`${API_URL}/productos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, categoria: normalizeCategoriaProducto(categoria) }),
        });
        if (response.ok) {
          const creado = (await response.json()) as ProductoDB;
          setProductos((prev) => [
            ...prev.filter((p) => p.id !== creado.id),
            { ...creado, categoria: normalizeCategoriaProducto(creado.categoria) },
          ]);
          await cargar();
          notificarCambios();
        }
        return response.ok;
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo crear el plato");
        return false;
      }
    },
    [cargar, notificarCambios]
  );

  const actualizar = useCallback(
    async (id: string, cambios: { nombre?: string; precio?: number }) => {
      setError(null);
      try {
        const response = await fetch(`${API_URL}/productos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cambios),
        });
        if (response.ok) {
          await cargar();
          notificarCambios();
        }
        return response.ok;
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo actualizar el plato");
        return false;
      }
    },
    [cargar, notificarCambios]
  );

  const eliminar = useCallback(async (id: string) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/productos/${id}`, { method: "DELETE" });
      if (response.ok) {
        await cargar();
        notificarCambios();
      }
      return response.ok;
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el plato");
      return false;
    }
  }, [cargar, notificarCambios]);

  return { productos, loading, error, crear, actualizar, eliminar, recargar: cargar };
};

import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useRestaurant } from "@/context/useRestaurant";
import { productoDBToProducto, useProductosDB } from "@/hooks/useProductosDB";
import { normalizeCategoriaProducto, POSTRES, PRIMER_PLATO, SEGUNDO_PLATO } from "@/lib/productCategories";
import AppHeader from "@/components/AppHeader";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIAS = [PRIMER_PLATO, SEGUNDO_PLATO, POSTRES] as const;
type CategoriaEditable = (typeof CATEGORIAS)[number];

const OPCIONES_CATEGORIA = [
  { value: "primero", label: PRIMER_PLATO, categoria: PRIMER_PLATO },
  { value: "segundo", label: SEGUNDO_PLATO, categoria: SEGUNDO_PLATO },
  { value: "postres", label: POSTRES, categoria: POSTRES },
] as const;

type CategoriaFormValue = (typeof OPCIONES_CATEGORIA)[number]["value"];

const categoriaDesdeFormulario = (value: CategoriaFormValue): CategoriaEditable =>
  OPCIONES_CATEGORIA.find((opcion) => opcion.value === value)?.categoria ?? PRIMER_PLATO;

const AdminProductosPage = () => {
  const navigate = useNavigate();
  const { empleadoActual, setProductosDinamicos } = useRestaurant();
  const { productos, loading, error, crear, actualizar, eliminar } = useProductosDB();
  const { toast } = useToast();

  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editPrecio, setEditPrecio] = useState("");

  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState<CategoriaFormValue>("primero");

  useEffect(() => {
    setProductosDinamicos(productos.map(productoDBToProducto));
  }, [productos, setProductosDinamicos]);

  const productosNormalizados = useMemo(
    () => productos.map((p) => ({
      ...p,
      categoria: normalizeCategoriaProducto(p.categoria),
    })),
    [productos]
  );

  const productosPorCategoria = useMemo(
    () =>
      CATEGORIAS.map((cat) => ({
        categoria: cat,
        items: productosNormalizados.filter((p) => p.categoria === cat),
      })),
    [productosNormalizados]
  );

  if (!empleadoActual) {
    return <Navigate to="/" replace />;
  }
  if (empleadoActual.rol !== "admin") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-foreground text-lg font-semibold">
              Acceso restringido
            </p>
            <p className="text-muted-foreground">
              Solo el administrador puede gestionar los platos.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-md bg-muted text-muted-foreground hover:bg-accent"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  const iniciarEdicion = (id: string, nombre: string, precio: number) => {
    setEditandoId(id);
    setEditNombre(nombre);
    setEditPrecio(precio.toString());
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEditNombre("");
    setEditPrecio("");
  };

  const guardarEdicion = async (id: string) => {
    const precioNum = parseFloat(editPrecio.replace(",", "."));
    if (!editNombre.trim() || isNaN(precioNum) || precioNum < 0) {
      toast({ title: "Datos inválidos", variant: "destructive" });
      return;
    }
    const ok = await actualizar(id, { nombre: editNombre.trim(), precio: precioNum });
    if (ok) {
      toast({ title: "Plato actualizado" });
      cancelarEdicion();
    } else {
      toast({ title: "Error al actualizar el plato", variant: "destructive" });
    }
  };

  const handleEliminar = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;
    const ok = await eliminar(id);
    if (ok) toast({ title: "Plato eliminado" });
    else toast({ title: "Error al eliminar el plato", variant: "destructive" });
  };

  const handleCrear = async () => {
    const precioNum = parseFloat(nuevoPrecio.replace(",", ".") || "0");
    if (!nuevoNombre.trim() || isNaN(precioNum) || precioNum < 0) {
      toast({ title: "Introduce nombre y precio válido", variant: "destructive" });
      return;
    }
    const ok = await crear(nuevoNombre.trim(), precioNum, categoriaDesdeFormulario(nuevaCategoria));
    if (ok) {
      toast({ title: "Plato añadido" });
      setNuevoNombre("");
      setNuevoPrecio("");
    } else {
      toast({ title: "Error al añadir el plato", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <div className="flex-1 p-3 sm:p-6 max-w-5xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Gestión de platos y postres
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md bg-muted text-muted-foreground hover:bg-accent transition-colors text-sm self-start sm:self-auto"
          >
            ← Volver
          </button>
        </div>

        {/* Formulario nuevo plato */}
        <div className="bg-card border border-border rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <h2 className="font-semibold text-foreground mb-3">Añadir plato</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_7rem_10rem_auto] gap-2 sm:gap-3 items-end">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Nombre</label>
              <input
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                placeholder="Ej: Paella"
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Precio (€)</label>
              <input
                value={nuevoPrecio}
                onChange={(e) => setNuevoPrecio(e.target.value)}
                placeholder="0.00"
                inputMode="decimal"
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Categoría</label>
              <select
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value as CategoriaFormValue)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
              >
                {OPCIONES_CATEGORIA.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleCrear}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 flex items-center justify-center gap-2 sm:col-span-2 lg:col-span-1"
            >
              <Plus size={16} /> Añadir
            </button>
          </div>
        </div>

        {/* Listado por categoría */}
        <div className="mb-3">
          <h2 className="text-lg font-bold text-foreground">Platos registrados</h2>
          <p className="text-sm text-muted-foreground">
            Primeros, segundos y postres guardados para el menú.
          </p>
        </div>

        {error && productosNormalizados.length === 0 && (
          <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            No se han podido cargar los platos desde el backend ({error}). Comprueba que Spring esté arrancado en http://localhost:8080.
          </div>
        )}

        {loading ? (
          <p className="text-muted-foreground">Cargando...</p>
        ) : (
          <div className="space-y-6">
            {productosPorCategoria.map(({ categoria: cat, items }) => {
              return (
                <div key={cat}>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {cat} <span className="text-sm font-normal text-muted-foreground">({items.length})</span>
                  </h3>
                  <div className="bg-card border border-border rounded-lg divide-y divide-border">
                    {items.length === 0 && (
                      <p className="p-4 text-sm text-muted-foreground">
                        Sin platos en esta categoría.
                      </p>
                    )}
                    {items.map((p) => {
                      const editando = editandoId === p.id;
                      return (
                        <div key={p.id} className="flex items-center gap-2 p-3">
                          {editando ? (
                            <>
                              <input
                                value={editNombre}
                                onChange={(e) => setEditNombre(e.target.value)}
                                className="flex-1 px-2 py-1 rounded border border-input bg-background text-foreground"
                              />
                              <input
                                value={editPrecio}
                                onChange={(e) => setEditPrecio(e.target.value)}
                                inputMode="decimal"
                                className="w-24 px-2 py-1 rounded border border-input bg-background text-foreground"
                              />
                              <span className="text-muted-foreground text-sm">€</span>
                              <button
                                onClick={() => guardarEdicion(p.id)}
                                className="p-2 rounded bg-success/10 text-success hover:bg-success/20"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={cancelarEdicion}
                                className="p-2 rounded bg-muted hover:bg-accent"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="flex-1 text-foreground font-medium">
                                {p.nombre}
                              </span>
                              <span className="text-foreground font-semibold w-20 text-right">
                                {Number(p.precio).toFixed(2)}€
                              </span>
                              <button
                                onClick={() => iniciarEdicion(p.id, p.nombre, Number(p.precio))}
                                className="p-2 rounded hover:bg-accent text-muted-foreground"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleEliminar(p.id, p.nombre)}
                                className="p-2 rounded hover:bg-destructive/10 text-destructive"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductosPage;

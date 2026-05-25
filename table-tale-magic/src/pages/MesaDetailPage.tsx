import { useParams, useNavigate } from "react-router-dom";
import { useRestaurant } from "@/context/useRestaurant";
import { productos as productosEstaticos } from "@/data/mockData";
import AppHeader from "@/components/AppHeader";
import { Pencil, Trash2, Plus, Minus, Settings } from "lucide-react";
import { useState, useMemo } from "react";
import { CategoriaProducto } from "@/types/restaurant";
import { MENU_DEL_DIA, normalizeCategoriaProducto, PRIMER_PLATO, SEGUNDO_PLATO } from "@/lib/productCategories";

const categorias: CategoriaProducto[] = ["Bebidas", "Cafés", MENU_DEL_DIA, "Postres"];

// Subcategorías que aparecen como "tarjetas" cuando se selecciona "Bebidas"
const subcategoriasBebida: { categoria: CategoriaProducto; emoji: string }[] = [
  { categoria: "Refrescos", emoji: "🥤" },
  { categoria: "Agua", emoji: "💧" },
  { categoria: "Cerveza", emoji: "🍺" },
  { categoria: "Vermouth", emoji: "🍷" },
];

// IDs de los productos "menú" con precio fijo
const ID_MEDIO_MENU = 700;
const ID_MENU_COMPLETO = 701;

type TipoMenu = "medio" | "completo";

const emojiCategoria = (cat: CategoriaProducto) => {
  switch (cat) {
    case "Refrescos": return "🥤";
    case "Agua": return "💧";
    case "Cerveza": return "🍺";
    case "Vermouth": return "🍷";
    case "Cafés": return "☕";
    case "1º plato": return "🥗";
    case "2º plato": return "🍖";
    case "Menú del día": return "🍽️";
    case "Postres": return "🍰";
    default: return "🥤";
  }
};

const MesaDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    mesas, getComandaAbierta, abrirComanda, getLineasDeComanda,
    agregarProducto, editarCantidadLinea, eliminarLinea,
    productosDinamicos, empleadoActual,
  } = useRestaurant();

  // Catálogo combinado: estáticos + dinámicos (de la base de datos)
  const productos = useMemo(
    () => [...productosEstaticos, ...productosDinamicos].map((p) => ({
      ...p,
      categoria: normalizeCategoriaProducto(p.categoria),
    })),
    [productosDinamicos]
  );

  const esAdmin = empleadoActual?.rol === "admin";

  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaProducto>("Bebidas");
  const [subcategoria, setSubcategoria] = useState<CategoriaProducto | null>(null);
  const [editandoLinea, setEditandoLinea] = useState<number | null>(null);

  // Flujo de menú del día
  const [tipoMenu, setTipoMenu] = useState<TipoMenu | null>(null);
  const [pasoMenu, setPasoMenu] = useState<"primero" | "segundo">("primero");
  const [primeroElegido, setPrimeroElegido] = useState<number | null>(null);

  const mesa = mesas.find((m) => m.id === Number(id));
  if (!mesa) return <div className="p-8 text-foreground">Mesa no encontrada</div>;

  let comanda = getComandaAbierta(mesa.id);
  const lineas = comanda ? getLineasDeComanda(comanda.id) : [];

  const tieneSubcategorias = categoriaActiva === "Bebidas";
  const subcategoriasActuales = categoriaActiva === "Bebidas" ? subcategoriasBebida : [];

  const categoriaParaProductos = tieneSubcategorias ? subcategoria : categoriaActiva;
  const productosFiltrados =
    categoriaParaProductos && categoriaActiva !== MENU_DEL_DIA
      ? productos.filter((p) => p.categoria === categoriaParaProductos)
      : [];

  const mostrandoTarjetasSubcategoria = tieneSubcategorias && !subcategoria;

  const resetFlujoMenu = () => {
    setTipoMenu(null);
    setPasoMenu("primero");
    setPrimeroElegido(null);
  };

  const handleSeleccionarCategoria = (cat: CategoriaProducto) => {
    setCategoriaActiva(cat);
    setSubcategoria(null);
    resetFlujoMenu();
  };

  const ensureComanda = () => {
    if (!comanda) comanda = abrirComanda(mesa.id);
    return comanda!;
  };

  const handleElegirTipoMenu = (tipo: TipoMenu) => {
    setTipoMenu(tipo);
    setPasoMenu("primero");
    setPrimeroElegido(null);
  };

  const handleElegirPlato = (idPlato: number) => {
    if (!tipoMenu) return;
    if (tipoMenu === "medio") {
      const c = ensureComanda();
      agregarProducto(c.id, ID_MEDIO_MENU);
      agregarProducto(c.id, idPlato);
      resetFlujoMenu();
    } else {
      if (pasoMenu === "primero") {
        setPrimeroElegido(idPlato);
        setPasoMenu("segundo");
      } else {
        const c = ensureComanda();
        agregarProducto(c.id, ID_MENU_COMPLETO);
        if (primeroElegido !== null) agregarProducto(c.id, primeroElegido);
        agregarProducto(c.id, idPlato);
        resetFlujoMenu();
      }
    }
  };

  const handleAbrirComanda = () => {
    abrirComanda(mesa.id);
  };

  const handleAgregarProducto = (idProducto: number) => {
    if (!comanda) {
      comanda = abrirComanda(mesa.id);
    }
    agregarProducto(comanda.id, idProducto);
  };

  const handlePagar = () => {
    if (comanda) navigate(`/pagar/${comanda.id}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left: order details (en móvil aparece debajo del catálogo) */}
        <div className="order-2 lg:order-1 w-full lg:w-80 lg:border-r border-t lg:border-t-0 border-border bg-card p-3 sm:p-4 flex flex-col max-h-[60vh] lg:max-h-none">
          <h2 className="text-xl font-bold mb-4 text-foreground">MESA {mesa.numeroMesa}</h2>

          {!comanda && mesa.estado === "Libre" ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <p className="text-muted-foreground">Mesa libre</p>
              <button
                onClick={handleAbrirComanda}
                className="px-6 py-3 rounded-md bg-success text-success-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Abrir Comanda
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto space-y-2">
                {lineas.map((linea) => {
                  const prod = productos.find((p) => p.id === linea.idProducto);
                  return (
                    <div key={linea.id} className="flex items-center justify-between py-2 px-2 rounded-md bg-secondary/50">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-foreground">
                          {prod?.nombre}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          {linea.cantidad} x {prod?.precio.toFixed(2)}€
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-foreground w-16 text-right">
                          {linea.subtotal.toFixed(2)}€
                        </span>
                        {editandoLinea === linea.id ? (
                          <div className="flex items-center gap-1 ml-2">
                            <button onClick={() => { if (linea.cantidad > 1) editarCantidadLinea(linea.id, linea.cantidad - 1); }}
                              className="p-1 rounded bg-muted hover:bg-accent"><Minus size={14} /></button>
                            <span className="text-sm w-6 text-center font-medium">{linea.cantidad}</span>
                            <button onClick={() => editarCantidadLinea(linea.id, linea.cantidad + 1)}
                              className="p-1 rounded bg-muted hover:bg-accent"><Plus size={14} /></button>
                            <button onClick={() => { eliminarLinea(linea.id); setEditandoLinea(null); }}
                              className="p-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 ml-1"><Trash2 size={14} /></button>
                            <button onClick={() => setEditandoLinea(null)}
                              className="p-1 rounded bg-muted hover:bg-accent text-xs ml-1">✓</button>
                          </div>
                        ) : (
                          <button onClick={() => setEditandoLinea(linea.id)}
                            className="p-1 rounded hover:bg-accent ml-1"><Pencil size={14} className="text-muted-foreground" /></button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-4 mt-4 space-y-3">
                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>TOTAL:</span>
                  <span>{comanda?.total.toFixed(2)}€</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex-1 py-3 rounded-md bg-muted text-muted-foreground font-medium hover:bg-accent transition-colors"
                  >
                    ← Volver
                  </button>
                  <button
                    onClick={handlePagar}
                    className="flex-1 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                  >
                    PAGAR
                  </button>
                </div>
              </div>
            </>
          )}

          {(!comanda && mesa.estado === "Libre") && (
            <button onClick={() => navigate(-1)}
              className="mt-3 w-full py-2 rounded-md bg-muted text-muted-foreground font-medium hover:bg-accent transition-colors">
              ← Volver
            </button>
          )}
        </div>

        {/* Right: product catalog */}
        <div className="order-1 lg:order-2 flex-1 p-3 sm:p-4 flex flex-col">
          {/* Category tabs */}
          <div className="flex gap-2 mb-4 flex-wrap items-center">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => handleSeleccionarCategoria(cat)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  categoriaActiva === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {cat}
              </button>
            ))}

            {esAdmin && (categoriaActiva === MENU_DEL_DIA || categoriaActiva === "Postres") && (
              <button
                onClick={() => navigate("/admin/productos")}
                className="ml-auto px-3 py-2 rounded-md text-sm font-medium bg-accent text-accent-foreground hover:opacity-90 flex items-center gap-1"
                title="Gestionar platos y postres"
              >
                <Settings size={14} /> Gestionar
              </button>
            )}

            {/* Breadcrumb / botón volver cuando estamos dentro de una subcategoría */}
            {tieneSubcategorias && subcategoria && (
              <>
                <span className="text-muted-foreground mx-1">›</span>
                <span className="px-3 py-2 rounded-md text-sm font-semibold bg-primary/10 text-primary">
                  {subcategoria}
                </span>
                <button
                  onClick={() => setSubcategoria(null)}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-muted text-muted-foreground hover:bg-accent transition-colors"
                >
                  ← Categorías
                </button>
              </>
            )}

            {/* Breadcrumb del menú del día */}
            {categoriaActiva === MENU_DEL_DIA && tipoMenu && (
              <>
                <span className="text-muted-foreground mx-1">›</span>
                <span className="px-3 py-2 rounded-md text-sm font-semibold bg-primary/10 text-primary">
                  {tipoMenu === "medio" ? "Medio menú · 10€" : "Menú completo · 13€"}
                </span>
                <span className="px-3 py-2 rounded-md text-sm font-medium bg-muted text-muted-foreground">
                  {tipoMenu === "completo" ? (pasoMenu === "primero" ? "Elige 1º plato" : "Elige 2º plato") : "Elige plato"}
                </span>
                <button
                  onClick={resetFlujoMenu}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-muted text-muted-foreground hover:bg-accent transition-colors"
                >
                  ← Cancelar
                </button>
              </>
            )}
          </div>

          {categoriaActiva === MENU_DEL_DIA ? (
            !tipoMenu ? (
              // Tarjetas de tipo de menú
              <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1 content-start max-w-2xl">
                <button
                  onClick={() => handleElegirTipoMenu("medio")}
                  className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:border-primary/40 transition-all active:scale-95 aspect-square"
                >
                  <div className="flex-1 flex items-center justify-center text-6xl">🍽️</div>
                  <span className="text-base font-bold text-foreground text-center">Medio menú</span>
                  <span className="text-xs text-muted-foreground">1 plato</span>
                  <span className="text-lg font-bold text-primary">10,00€</span>
                </button>
                <button
                  onClick={() => handleElegirTipoMenu("completo")}
                  className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:border-primary/40 transition-all active:scale-95 aspect-square"
                >
                  <div className="flex-1 flex items-center justify-center text-6xl">🍽️🍽️</div>
                  <span className="text-base font-bold text-foreground text-center">Menú completo</span>
                  <span className="text-xs text-muted-foreground">2 platos</span>
                  <span className="text-lg font-bold text-primary">13,00€</span>
                </button>
              </div>
            ) : (
              // Selector de plato (1º o 2º según paso/tipo)
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 flex-1 content-start">
                {productos
                  .filter((p) => {
                    if (tipoMenu === "medio") return p.categoria === PRIMER_PLATO || p.categoria === SEGUNDO_PLATO;
                    return p.categoria === (pasoMenu === "primero" ? PRIMER_PLATO : SEGUNDO_PLATO);
                  })
                  .map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => handleElegirPlato(prod.id)}
                      className="bg-card border border-border rounded-lg p-3 flex flex-col items-center gap-2 hover:shadow-md hover:border-primary/30 transition-all active:scale-95"
                    >
                      <div className="w-full aspect-square bg-muted rounded-md flex items-center justify-center text-3xl overflow-hidden">
                        {emojiCategoria(prod.categoria)}
                      </div>
                      <span className="text-xs font-medium text-foreground text-center leading-tight">
                        {prod.nombre}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {prod.categoria}
                      </span>
                    </button>
                  ))}
              </div>
            )
          ) : mostrandoTarjetasSubcategoria ? (
            // Vista de subcategorías como tarjetas grandes
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 flex-1 content-start">
              {subcategoriasActuales.map((sub) => {
                const cantidad = productos.filter((p) => p.categoria === sub.categoria).length;
                return (
                  <button
                    key={sub.categoria}
                    onClick={() => setSubcategoria(sub.categoria)}
                    className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:border-primary/40 transition-all active:scale-95 aspect-square"
                  >
                    <div className="flex-1 flex items-center justify-center text-6xl">
                      {sub.emoji}
                    </div>
                    <span className="text-base font-bold text-foreground text-center">
                      {sub.categoria}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {cantidad} productos
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            // Vista de productos
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 flex-1 content-start">
              {productosFiltrados.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => handleAgregarProducto(prod.id)}
                  className="bg-card border border-border rounded-lg p-3 flex flex-col items-center gap-2 hover:shadow-md hover:border-primary/30 transition-all active:scale-95"
                >
                  <div className="w-full aspect-square bg-muted rounded-md flex items-center justify-center text-2xl overflow-hidden">
                    {prod.imagen ? (
                      <img
                        src={prod.imagen}
                        alt={prod.nombre}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      emojiCategoria(prod.categoria)
                    )}
                  </div>
                  <span className="text-xs font-medium text-foreground text-center leading-tight">
                    {prod.nombre}
                  </span>
                  <span className="text-xs font-bold text-primary">
                    {prod.precio.toFixed(2)}€
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MesaDetailPage;

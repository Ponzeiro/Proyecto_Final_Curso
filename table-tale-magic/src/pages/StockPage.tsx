import { Navigate, useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import { productos } from "@/data/mockData";
import { useRestaurant } from "@/context/useRestaurant";
import { ArrowLeft, Package } from "lucide-react";
import { CategoriaProducto } from "@/types/restaurant";

const CATEGORIAS_BEBIDAS: CategoriaProducto[] = ["Refrescos", "Agua", "Cerveza", "Vermouth"];

const StockPage = () => {
  const navigate = useNavigate();
  const { empleadoActual } = useRestaurant();

  if (!empleadoActual) {
    return <Navigate to="/" replace />;
  }

  if (empleadoActual.rol !== "admin") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-3">
            <p className="text-foreground text-lg font-semibold">Acceso restringido</p>
            <p className="text-muted-foreground">Solo el administrador puede consultar el stock.</p>
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

  const bebidas = productos.filter((producto) =>
    CATEGORIAS_BEBIDAS.includes(producto.categoria)
  );

  const totalUnidades = bebidas.reduce((total, producto) => total + producto.cantidad, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 p-3 sm:p-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Stock de bebidas</h1>
            <p className="text-sm text-muted-foreground">
              {bebidas.length} bebidas registradas · {totalUnidades} unidades
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md bg-muted text-muted-foreground hover:bg-accent transition-colors text-sm self-start sm:self-auto flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Volver
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {CATEGORIAS_BEBIDAS.map((categoria) => {
            const items = bebidas.filter((producto) => producto.categoria === categoria);
            const unidades = items.reduce((total, producto) => total + producto.cantidad, 0);

            return (
              <section key={categoria} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2 min-w-0">
                    <Package size={18} className="text-primary shrink-0" />
                    <h2 className="font-bold text-foreground truncate">{categoria}</h2>
                  </div>
                  <span className="text-xs font-semibold rounded-full bg-primary/10 text-primary px-2 py-1">
                    {unidades} uds
                  </span>
                </div>

                <div className="divide-y divide-border">
                  {items.map((producto) => (
                    <div
                      key={producto.id}
                      className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-foreground min-w-0">
                        {producto.nombre}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {producto.precio.toFixed(2)}€
                      </span>
                      <span className="text-sm font-bold text-foreground tabular-nums">
                        Stock: {producto.cantidad}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default StockPage;

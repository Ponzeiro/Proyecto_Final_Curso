import { useNavigate } from "react-router-dom";
import { useRestaurant } from "@/context/useRestaurant";
import { Mesa } from "@/types/restaurant";
import AppHeader from "@/components/AppHeader";

interface MesasViewProps {
  zona: "bar" | "comedor";
}

const MesasView = ({ zona }: MesasViewProps) => {
  const { mesas, getComandaAbierta } = useRestaurant();
  const navigate = useNavigate();
  const mesasZona = mesas.filter((m) => m.zona === zona);

  const handleMesaClick = (mesa: Mesa) => {
    navigate(`/mesa/${mesa.id}`);
  };

  const renderMesa = (mesa: Mesa, extraClasses = "") => {
    const comanda = getComandaAbierta(mesa.id);
    const isOcupada = mesa.estado === "Ocupado";
    return (
      <button
        key={mesa.id}
        onClick={() => handleMesaClick(mesa)}
        className={`
          relative rounded-lg font-bold transition-all active:scale-95 flex flex-col items-center justify-center gap-1 p-3
          ${isOcupada
            ? "bg-mesa-ocupada text-mesa-ocupada-foreground shadow-lg"
            : "bg-mesa-libre text-mesa-libre-foreground shadow-md hover:shadow-lg"
          }
          ${extraClasses}
        `}
      >
        <span className="text-base leading-tight">MESA {mesa.numeroMesa}</span>
        {zona === "comedor" && (
          <span className="text-[11px] sm:text-xs font-semibold opacity-90 leading-tight">
            Comensales: {mesa.capacidad}
          </span>
        )}
        {isOcupada && comanda && (
          <span className="text-xs font-medium opacity-90">
            {comanda.total.toFixed(2)}€
          </span>
        )}
      </button>
    );
  };

  // Helper: get mesa by numeroMesa
  const m = (num: number) => mesasZona.find((x) => x.numeroMesa === num);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <div className="flex-1 p-3 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground uppercase">
            {zona === "bar" ? "Zona Bar" : "Zona Comedor"}
          </h2>
        </div>

        {zona === "bar" ? (
          // BAR: 3 mesas en fila + taburetes circulares + barra
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-3 sm:gap-8 mb-6 sm:mb-10 px-2 sm:px-8">
              {[1, 2, 3].map((num) => {
                const mesa = m(num);
                return mesa ? (
                  <div key={mesa.id} className="flex flex-col items-center gap-2">
                    {renderMesa(mesa, "w-full max-w-32 aspect-square")}
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold">
                      {mesa.estado === "Ocupado" ? "OCUPADA" : "LIBRE"}
                    </span>
                  </div>
                ) : null;
              })}
            </div>

            {/* Taburetes (mesas circulares delante de la barra) */}
            <div className="flex flex-wrap justify-around items-center gap-2 mb-3 px-2 sm:px-4">
              {[4, 5, 6, 7, 8, 9].map((num) => {
                const mesa = m(num);
                if (!mesa) return null;
                const isOcupada = mesa.estado === "Ocupado";
                const comanda = getComandaAbierta(mesa.id);
                return (
                  <button
                    key={mesa.id}
                    onClick={() => handleMesaClick(mesa)}
                    title={`Mesa ${mesa.numeroMesa}${isOcupada && comanda ? ` · ${comanda.total.toFixed(2)}€` : ""}`}
                    className={`
                      w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold text-xs flex items-center justify-center transition-all active:scale-95 border
                      ${isOcupada
                        ? "bg-mesa-ocupada text-mesa-ocupada-foreground border-mesa-ocupada shadow-md"
                        : "bg-mesa-libre text-mesa-libre-foreground border-mesa-libre shadow-sm hover:shadow-md"
                      }
                    `}
                  >
                    {mesa.numeroMesa}
                  </button>
                );
              })}
            </div>

            {/* Barra */}
            <div className="h-10 sm:h-12 bg-muted rounded-md flex items-center justify-center text-muted-foreground font-bold tracking-widest text-sm sm:text-base">
              BARRA
            </div>
          </div>
        ) : (
          // COMEDOR: cuadrícula simétrica con todas las mesas
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
            {mesasZona
              .sort((a, b) => a.numeroMesa - b.numeroMesa)
              .map((mesa) => (
                <div key={mesa.id} className="flex flex-col items-center gap-2">
                  {renderMesa(mesa, "w-full h-24 sm:h-28")}
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold">
                    {mesa.estado === "Ocupado" ? "OCUPADA" : "LIBRE"}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MesasView;

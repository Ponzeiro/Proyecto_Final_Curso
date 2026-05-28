import { useNavigate, useLocation } from "react-router-dom";
import { useRestaurant } from "@/context/useRestaurant";
import { Clock, LogOut, Package } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/barCancelaLogo.png";

const AppHeader = () => {
  const { empleadoActual, logout } = useRestaurant();
  const navigate = useNavigate();
  const location = useLocation();
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const isBar = location.pathname.startsWith("/bar");
  const toggleZona = () => navigate(isBar ? "/comedor" : "/bar");

  return (
    <header className="bg-header text-header-foreground flex flex-wrap items-center justify-between gap-2 px-3 sm:px-6 py-2 sm:py-3">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <img
          src={logo}
          alt="A Cancela Logo"
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover shadow-sm"
        />
        <span className="text-sm sm:text-lg font-medium truncate">
          ¡Hola, {empleadoActual?.nombre}!
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          <Clock size={14} className="sm:hidden" />
          <Clock size={16} className="hidden sm:inline" />
          {hora.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
        </div>

        <button
          onClick={toggleZona}
          className="px-3 sm:px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {isBar ? "COMEDOR →" : "BAR →"}
        </button>

        {empleadoActual?.rol === "admin" && (
          <button
            onClick={() => navigate("/admin/stock")}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-md bg-secondary text-secondary-foreground text-xs sm:text-sm font-medium hover:bg-accent transition-colors"
          >
            <Package size={16} />
            <span>STOCK</span>
          </button>
        )}

        <button
          onClick={() => { logout(); navigate("/"); }}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium hover:bg-destructive/20 transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">CERRAR SESIÓN</span>
        </button>
      </div>
    </header>
  );
};

export default AppHeader;

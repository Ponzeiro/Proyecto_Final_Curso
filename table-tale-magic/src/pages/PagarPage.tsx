import { useParams, useNavigate } from "react-router-dom";
import { useRestaurant } from "@/context/useRestaurant";
import { MetodoPago } from "@/types/restaurant";
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import barCancelaLogo from "@/assets/barCancelaTarjeta.jpeg";
import { productos as productosEstaticos } from "@/data/mockData";

const PagarPage = () => {
  const { idComanda } = useParams();
  const navigate = useNavigate();
  const { comandas, pagarComanda, mesas, getLineasDeComanda, productosDinamicos } = useRestaurant();
  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(null);

  const productos = useMemo(
    () => [...productosEstaticos, ...productosDinamicos],
    [productosDinamicos]
  );

  const comanda = comandas.find((c) => c.id === Number(idComanda));
  if (!comanda) return <div className="p-8 text-foreground">Comanda no encontrada</div>;

  const mesa = mesas.find((m) => m.id === comanda.idMesa);
  const lineas = getLineasDeComanda(comanda.id);

  const abrirTicket = () => {
    const fecha = new Date().toLocaleString("es-ES");
    const filas = lineas
      .map((l) => {
        const prod = productos.find((p) => p.id === l.idProducto);
        const nombre = prod?.nombre ?? "Producto";
        const precio = prod?.precio ?? 0;
        return `
          <tr>
            <td>${l.cantidad}</td>
            <td>${nombre}</td>
            <td style="text-align:right">${precio.toFixed(2)}€</td>
            <td style="text-align:right">${l.subtotal.toFixed(2)}€</td>
          </tr>`;
      })
      .join("");

    const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Ticket Mesa ${mesa?.numeroMesa ?? ""}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Courier New', monospace; max-width: 360px; margin: 16px auto; padding: 12px; color: #111; }
    h1 { font-size: 18px; text-align: center; margin: 0 0 4px; }
    .sub { text-align: center; font-size: 12px; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { padding: 4px 2px; border-bottom: 1px dashed #999; }
    th { text-align: left; }
    tfoot td { border: none; font-weight: bold; font-size: 16px; padding-top: 10px; }
    .meta { margin: 8px 0; font-size: 12px; }
    .center { text-align: center; }
    @media print { body { margin: 0; } .noprint { display: none; } }
    button { margin-top: 16px; padding: 8px 14px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>BAR A CANCELA</h1>
  <div class="sub">Ticket de comanda</div>
  <div class="meta">
    <div>Mesa: <strong>${mesa?.numeroMesa ?? "-"}</strong></div>
    <div>Comanda: #${comanda.id}</div>
    <div>Fecha: ${fecha}</div>
    ${metodoPago ? `<div>Método de pago: ${metodoPago.toUpperCase()}</div>` : ""}
  </div>
  <table>
    <thead>
      <tr><th>Cant</th><th>Producto</th><th style="text-align:right">Precio</th><th style="text-align:right">Total</th></tr>
    </thead>
    <tbody>${filas}</tbody>
    <tfoot>
      <tr><td colspan="3">TOTAL</td><td style="text-align:right">${comanda.total.toFixed(2)}€</td></tr>
    </tfoot>
  </table>
  <div class="center" style="margin-top:14px; font-size:12px;">¡Gracias por su visita!</div>
  <div class="center noprint">
    <button onclick="window.print()">Imprimir</button>
  </div>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (!win) {
      toast({ title: "No se pudo abrir el ticket", description: "Permite las ventanas emergentes", variant: "destructive" });
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  const handlePagar = () => {
    if (!metodoPago) {
      toast({ title: "Selecciona un método de pago", variant: "destructive" });
      return;
    }
    abrirTicket();
    pagarComanda(comanda.id, metodoPago);
    toast({ title: "¡Pago realizado!", description: `Mesa ${mesa?.numeroMesa} - ${comanda.total.toFixed(2)}€` });
    navigate("/bar");
  };

  const metodos: { key: MetodoPago; label: string }[] = [
    { key: "efectivo", label: "EFECTIVO" },
    { key: "tarjeta", label: "TARJETA" },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-2 sm:p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-lg w-full overflow-hidden animate-fade-in">
        {/* Logo area */}
        <div className="bg-header flex justify-center py-3 sm:py-4">
          <img
            src={barCancelaLogo}
            alt="Bar A Cancela - Menú del día"
            className="h-28 sm:h-36 md:h-44 w-auto object-contain"
          />
        </div>

        <div className="p-4 sm:p-6 flex flex-col items-center gap-4 sm:gap-6">
          {/* Payment methods */}
          <div className="space-y-2 sm:space-y-3 w-full flex flex-col items-center">
            {metodos.map((m) => (
              <button
                key={m.key}
                onClick={() => setMetodoPago(m.key)}
                className={`w-full max-w-xs py-3 rounded-md text-sm font-semibold transition-all ${metodoPago === m.key
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Total below */}
          <div className="w-full flex flex-col items-center border-t border-border pt-3 sm:pt-4">
            <span className="text-muted-foreground text-xs sm:text-sm font-medium mb-1 sm:mb-2">TOTAL:</span>
            <span className="text-4xl sm:text-5xl font-extrabold text-foreground">
              {comanda.total.toFixed(2)}€
            </span>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="border-t border-border p-3 sm:p-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={handlePagar}
            className="flex-1 py-3 rounded-md bg-success text-success-foreground font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base"
          >
            IMPRIMIR TICKET
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-3 rounded-md bg-muted text-muted-foreground font-semibold hover:bg-accent transition-colors text-sm sm:text-base"
          >
            SALIR
          </button>
        </div>
      </div>
    </div>
  );
};

export default PagarPage;

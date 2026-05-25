import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurant } from "@/context/useRestaurant";
import { toast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [pin, setPin] = useState("");
  const { login } = useRestaurant();
  const navigate = useNavigate();

  const handleDigit = (d: string) => {
    if (pin.length < 4) setPin((p) => p + d);
  };

  const handleDelete = () => setPin((p) => p.slice(0, -1));
  const handleClear = () => setPin("");

  const handleSubmit = () => {
    if (login(pin)) {
      navigate("/bar");
    } else {
      toast({ title: "PIN incorrecto", description: "Inténtalo de nuevo", variant: "destructive" });
      setPin("");
    }
  };

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "-"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm bg-card rounded-lg shadow-lg overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-header text-header-foreground text-center py-4 px-6">
          <h1 className="text-xl font-bold tracking-wide">BAR A CANCELA</h1>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-center text-muted-foreground font-medium">INTRODUZCA PIN:</p>

          {/* PIN display */}
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-md border-2 border-border flex items-center justify-center text-2xl font-bold"
              >
                {pin[i] ? "•" : ""}
              </div>
            ))}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2">
            {digits.map((d) => (
              <button
                key={d}
                onClick={() => {
                  if (d === "-") handleDelete();
                  else if (d === "*") handleClear();
                  else handleDigit(d);
                }}
                className="h-14 rounded-md bg-secondary text-secondary-foreground text-xl font-semibold hover:bg-accent transition-colors active:scale-95"
              >
                {d === "-" ? "⌫" : d === "*" ? "C" : d}
              </button>
            ))}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={pin.length !== 4}
            className="w-full h-12 rounded-md bg-primary text-primary-foreground font-semibold text-lg disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

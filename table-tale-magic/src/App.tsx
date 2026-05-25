import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RestaurantProvider } from "@/context/RestaurantContext";
import ProductosSync from "@/components/ProductosSync";
import LoginPage from "@/pages/LoginPage";
import BarPage from "@/pages/BarPage";
import ComedorPage from "@/pages/ComedorPage";
import MesaDetailPage from "@/pages/MesaDetailPage";
import PagarPage from "@/pages/PagarPage";
import AdminProductosPage from "@/pages/AdminProductosPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RestaurantProvider>
        <ProductosSync />
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/bar" element={<BarPage />} />
            <Route path="/comedor" element={<ComedorPage />} />
            <Route path="/mesa/:id" element={<MesaDetailPage />} />
            <Route path="/pagar/:idComanda" element={<PagarPage />} />
            <Route path="/admin/productos" element={<AdminProductosPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RestaurantProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

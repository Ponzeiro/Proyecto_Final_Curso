import { useEffect } from "react";
import { useRestaurant } from "@/context/useRestaurant";
import { useProductosDB, productoDBToProducto } from "@/hooks/useProductosDB";

const ProductosSync = () => {
  const { setProductosDinamicos } = useRestaurant();
  const { productos } = useProductosDB();

  useEffect(() => {
    setProductosDinamicos(productos.map(productoDBToProducto));
  }, [productos, setProductosDinamicos]);

  return null;
};

export default ProductosSync;

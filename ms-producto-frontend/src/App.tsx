import { Link, Navigate, Route, Routes } from "react-router-dom";
import { ProductosPage } from "./pages/ProductosPage";
/*import { ProductoFormPage } from "./pages/ProductoFormPage";
import { VentasPage } from "./pages/VentasPage";
import { InventarioPage } from "./pages/InventarioPage";*/

export default function App() {
  return (
    <>
      <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        <Link to="/productos">Productos</Link>
        <Link to="/ventas">Ventas</Link>
        <Link to="/inventario">Inventario</Link>
      </nav>
      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/productos" replace />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/productos/nuevo" element={null} />
          <Route path="/productos/:id/editar" element={null} />
          <Route path="/ventas" element={null} />
          <Route path="/inventario" element={null} />
        </Routes>
      </main>
    </>
  );
}
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { ProductosPage } from "./pages/ProductosPage";
import { ProductoFormPage } from "./pages/ProductoFormPage";
import { InventarioPage } from "./pages/InventarioPage";
import { Icon } from "./components/Icon";

const claseNav = ({ isActive }: { isActive: boolean }) => (isActive ? "activo" : undefined);

export default function App() {
  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <div className="brand">
            <div className="brand-mark"><Icon name="inventory_2" /></div>
            <div>
              <div className="brand-name">Bodega Control Operativo</div>
              <div className="brand-sub">Sistema de Gestión de Productos e Inventario</div>
            </div>
          </div>
          <nav className="nav" aria-label="Principal">
            <NavLink to="/productos" className={claseNav}>Productos</NavLink>
            <NavLink to="/inventario" className={claseNav}>Inventario</NavLink>
          </nav>
          <div className="env">
            <small>Moneda</small>
            <span className="mono">Soles (PEN)</span>
          </div>
        </div>
      </header>
      <main className="page">
        <Routes>
          <Route path="/" element={<Navigate to="/productos" replace />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/productos/nuevo" element={<ProductoFormPage />} />
          <Route path="/productos/:id/editar" element={<ProductoFormPage />} />
          <Route path="/inventario" element={<InventarioPage />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-in">
          <span>© Bodega Control Operativo</span>
          <span className="mono">Todos los importes en Soles (S/)</span>
        </div>
      </footer>
    </>
  );
}

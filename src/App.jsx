import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Ingredientes from "./pages/Ingredientes";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas";

function App() {

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  function cerrarSesion() {
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  }

  return (
    <BrowserRouter>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
        
        <nav className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-4 shadow-lg">

        <div className="flex items-center justify-between">

        <div className="text-2xl font-bold">
          🍦 Crazy Happy
        </div>
        </div>
    <ul className="flex gap-6 font-semibold items-center">

            <li>
              <Link to="/">Inicio</Link>
            </li>

            {!usuario && (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}

            {usuario?.rol === "admin" && (
              <li>
                <Link to="/ingredientes">
                  Ingredientes
                </Link>
              </li>
            )}

            {usuario && (
              <li>
                <Link to="/productos">
                  Productos
                </Link>
              </li>
            )}

            {(usuario?.rol === "admin" ||
              usuario?.rol === "empleado") && (
              <li>
                <Link to="/ventas">
                  Ventas
                </Link>
              </li>
            )}

            {usuario && (
              <>
                <li className="ml-auto">
                  {usuario.nombre} ({usuario.rol})
                </li>

                <li>
                  <button
                  onClick={cerrarSesion}
                   className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition">Cerrar Sesión</button>
                </li>
              </>
            )}

          </ul>

        </nav>

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/ingredientes"
            element={<Ingredientes />}
          />

          <Route
            path="/productos"
            element={<Productos />}
          />

          <Route
            path="/ventas"
            element={<Ventas />}
          />

        </Routes>

      </div>

    </BrowserRouter>
  );
}

export default App;
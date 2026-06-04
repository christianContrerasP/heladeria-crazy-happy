import { useState } from "react";
import { supabase } from "../services/supabaseClient";

function Login() {

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  async function iniciarSesion() {

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("correo", correo)
      .eq("password", password)
      .single();

    if (error || !data) {
      alert("Correo o contraseña incorrectos");
      return;
    }

    localStorage.setItem(
      "usuario",
      JSON.stringify(data)
    );

    alert(
      `Bienvenido ${data.nombre} (${data.rol})`
    );

    window.location.href = "/";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-200">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <div className="text-center mb-6">

          <h1 className="text-4xl font-bold text-blue-700">
            🍦 Crazy Happy
          </h1>

          <p className="text-gray-500 mt-2">
            Sistema de Gestión de Heladería
          </p>

        </div>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={iniciarSesion}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition font-semibold"
        >
          Ingresar
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            React + Supabase + TailwindCSS
          </p>
        </div>

      </div>

    </div>
  );
}

export default Login;
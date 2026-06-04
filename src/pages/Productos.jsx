import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

function Productos() {

  const [productos, setProductos] = useState([]);

  const [idEditar, setIdEditar] = useState(null);

  const [nombre, setNombre] = useState("");
  const [precioPublico, setPrecioPublico] = useState("");
  const [tipo, setTipo] = useState("");
  const [vaso, setVaso] = useState("");
  const [volumenOnzas, setVolumenOnzas] = useState("");

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  async function obtenerProductos() {

    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("id");

    if (error) {
      console.error(error);
      return;
    }

    setProductos(data);
  }

  async function agregarProducto() {

    const { error } = await supabase
      .from("productos")
      .insert([
        {
          nombre,
          precio_publico: Number(precioPublico),
          tipo,
          vaso,
          volumen_onzas: volumenOnzas
            ? Number(volumenOnzas)
            : null,
        },
      ]);

    if (error) {
      console.error(error);
      alert("Error al guardar");
      return;
    }

    limpiarFormulario();
    obtenerProductos();

    alert("Producto agregado");
  }

  function cargarProducto(producto) {

    setIdEditar(producto.id);

    setNombre(producto.nombre);
    setPrecioPublico(producto.precio_publico);
    setTipo(producto.tipo);
    setVaso(producto.vaso || "");
    setVolumenOnzas(producto.volumen_onzas || "");
  }

  async function actualizarProducto() {

    const { error } = await supabase
      .from("productos")
      .update({
        nombre,
        precio_publico: Number(precioPublico),
        tipo,
        vaso,
        volumen_onzas: volumenOnzas
          ? Number(volumenOnzas)
          : null,
      })
      .eq("id", idEditar);

    if (error) {
      console.error(error);
      alert("Error al actualizar");
      return;
    }

    limpiarFormulario();
    obtenerProductos();

    alert("Producto actualizado");
  }

  async function eliminarProducto(id) {

    const confirmar = window.confirm(
      "¿Eliminar producto?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("productos")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Error al eliminar");
      return;
    }

    obtenerProductos();

    alert("Producto eliminado");
  }

  async function comprarProducto(producto) {

  const { error } = await supabase
    .from("ventas")
    .insert([
      {
        producto_id: producto.id,
        user_id: usuario.id,
        cantidad: 1,
        total: producto.precio_publico
      }
    ]);

  if (error) {
    alert(JSON.stringify(error));
    console.error(error);
    return;
  }

  alert("Compra realizada correctamente");
}

  function limpiarFormulario() {

    setIdEditar(null);

    setNombre("");
    setPrecioPublico("");
    setTipo("");
    setVaso("");
    setVolumenOnzas("");
  }

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Productos
      </h1>

      {usuario?.rol !== "cliente" && (

        <div className="bg-white p-4 rounded shadow mb-6">

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">

            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) =>
                setNombre(e.target.value)
              }
              className="border p-2 rounded"
            />

            <input
              type="number"
              placeholder="Precio"
              value={precioPublico}
              onChange={(e) =>
                setPrecioPublico(e.target.value)
              }
              className="border p-2 rounded"
            />

            <input
              type="text"
              placeholder="Tipo"
              value={tipo}
              onChange={(e) =>
                setTipo(e.target.value)
              }
              className="border p-2 rounded"
            />

            <input
              type="text"
              placeholder="Vaso"
              value={vaso}
              onChange={(e) =>
                setVaso(e.target.value)
              }
              className="border p-2 rounded"
            />

            <input
              type="number"
              placeholder="Onzas"
              value={volumenOnzas}
              onChange={(e) =>
                setVolumenOnzas(e.target.value)
              }
              className="border p-2 rounded"
            />

          </div>

          <div className="mt-4 flex gap-2">

            {idEditar ? (
              <>
                <button
                  onClick={actualizarProducto}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Actualizar
                </button>

                <button
                  onClick={limpiarFormulario}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={agregarProducto}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Guardar Producto
              </button>
            )}

          </div>

        </div>

      )}

      <table className="w-full bg-white shadow rounded">

        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Tipo</th>
            <th className="p-2">Vaso</th>
            <th className="p-2">Onzas</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>

        <tbody>

          {productos.map((producto) => (

            <tr key={producto.id}>

              <td className="border p-2">
                {producto.id}
              </td>

              <td className="border p-2">
                {producto.nombre}
              </td>

              <td className="border p-2">
                ${producto.precio_publico}
              </td>

              <td className="border p-2">
                {producto.tipo}
              </td>

              <td className="border p-2">
                {producto.vaso}
              </td>

              <td className="border p-2">
                {producto.volumen_onzas}
              </td>

              <td className="border p-2">

                <div className="flex gap-2">

                  {usuario?.rol !== "cliente" && (
                    <>
                      <button
                        onClick={() =>
                          cargarProducto(producto)
                        }
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() =>
                          eliminarProducto(producto.id)
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Eliminar
                      </button>
                    </>
                  )}

                  {usuario?.rol === "cliente" && (
                    <button
                      onClick={() =>
                        comprarProducto(producto)
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Comprar
                    </button>
                  )}

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Productos;
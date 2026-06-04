import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

function Ventas() {

  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);

  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("");

  async function obtenerVentas() {

    const { data, error } = await supabase
      .from("ventas")
      .select("*")
      .order("id");

    if (error) {
      console.error(error);
      return;
    }

    setVentas(data);
  }

  async function obtenerProductos() {

    const { data, error } = await supabase
      .from("productos")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    setProductos(data);
  }

  async function agregarVenta() {

    const productoSeleccionado = productos.find(
      (producto) => producto.id == productoId
    );

    if (!productoSeleccionado) {
      alert("Seleccione un producto");
      return;
    }

    const total =
      Number(productoSeleccionado.precio_publico) *
      Number(cantidad);

    const { error } = await supabase
      .from("ventas")
      .insert([
        {
          producto_id: Number(productoId),
          cantidad: Number(cantidad),
          total: total
        }
      ]);

    if (error) {
      console.error(error);
      alert("Error al guardar venta");
      return;
    }

    alert("Venta registrada");

    setProductoId("");
    setCantidad("");

    obtenerVentas();
  }

  async function eliminarVenta(id) {

    const confirmar = window.confirm(
      "¿Eliminar venta?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("ventas")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    obtenerVentas();
  }

  useEffect(() => {
    obtenerVentas();
    obtenerProductos();
  }, []);

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Ventas
      </h1>

      <div className="bg-white p-4 rounded shadow mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          <select
            value={productoId}
            onChange={(e) =>
              setProductoId(e.target.value)
            }
            className="border p-2 rounded"
          >
            <option value="">
              Seleccione producto
            </option>

            {productos.map((producto) => (
              <option
                key={producto.id}
                value={producto.id}
              >
                {producto.nombre}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) =>
              setCantidad(e.target.value)
            }
            className="border p-2 rounded"
          />

        </div>

        <button
          onClick={agregarVenta}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Registrar Venta
        </button>

      </div>

      <table className="w-full bg-white shadow rounded">

        <thead>

          <tr className="bg-gray-200">

            <th className="p-2">ID</th>
            <th className="p-2">Producto</th>
            <th className="p-2">Cantidad</th>
            <th className="p-2">Total</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Acciones</th>

          </tr>

        </thead>

        <tbody>

          {ventas.map((venta) => (

            <tr key={venta.id}>

              <td className="border p-2">
                {venta.id}
              </td>

              <td className="border p-2">
                 {productos.find(
                (producto) =>
                producto.id === venta.producto_id
                )?.nombre
                }
              </td>

              <td className="border p-2">
                {venta.cantidad}
              </td>

              <td className="border p-2">
                ${venta.total}
              </td>

              <td className="border p-2">
                {new Date(
                venta.fecha
                ).toLocaleString()}
              </td>

              <td className="border p-2">

                <button
                  onClick={() =>
                    eliminarVenta(venta.id)
                  }
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Eliminar
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Ventas;
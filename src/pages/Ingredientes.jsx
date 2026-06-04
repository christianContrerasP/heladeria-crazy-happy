import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

function Ingredientes() {

  // Lista de ingredientes
  const [ingredientes, setIngredientes] = useState([]);

  // Id del ingrediente que se está editando
  const [idEditar, setIdEditar] = useState(null);

  // Campos del formulario
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [calorias, setCalorias] = useState("");
  const [inventario, setInventario] = useState("");
  const [tipo, setTipo] = useState("");

  // Obtener ingredientes
  async function obtenerIngredientes() {

    const { data, error } = await supabase
      .from("ingredientes")
      .select("*")
      .order("id");

    if (error) {
      console.error(error);
      return;
    }

    setIngredientes(data);
  }

  // Agregar ingrediente
  async function agregarIngrediente() {

    if (
      !nombre ||
      !precio ||
      !calorias ||
      !inventario ||
      !tipo
    ) {
      alert("Completa todos los campos");
      return;
    }

    const { error } = await supabase
      .from("ingredientes")
      .insert([
        {
          nombre,
          precio: Number(precio),
          calorias: Number(calorias),
          inventario: Number(inventario),
          es_vegetariano: true,
          es_sano: true,
          tipo
        }
      ]);

    if (error) {
      console.error(error);
      alert("Error al guardar");
      return;
    }

    limpiarFormulario();
    obtenerIngredientes();

    alert("Ingrediente agregado correctamente");
  }

  // Cargar datos al formulario
  function cargarIngrediente(ingrediente) {

    setIdEditar(ingrediente.id);
    setNombre(ingrediente.nombre);
    setPrecio(ingrediente.precio);
    setCalorias(ingrediente.calorias);
    setInventario(ingrediente.inventario);
    setTipo(ingrediente.tipo);
  }

  // Actualizar ingrediente
  async function actualizarIngrediente() {

    const { error } = await supabase
      .from("ingredientes")
      .update({
        nombre,
        precio: Number(precio),
        calorias: Number(calorias),
        inventario: Number(inventario),
        tipo
      })
      .eq("id", idEditar);

    if (error) {
      console.error(error);
      alert("Error al actualizar");
      return;
    }

    alert("Ingrediente actualizado");

    limpiarFormulario();
    obtenerIngredientes();
  }

  // Eliminar ingrediente
  async function eliminarIngrediente(id) {

    const confirmar = window.confirm(
      "¿Deseas eliminar este ingrediente?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("ingredientes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Error al eliminar");
      return;
    }

    alert("Ingrediente eliminado");

    obtenerIngredientes();
  }

  // Limpiar formulario
  function limpiarFormulario() {

    setIdEditar(null);
    setNombre("");
    setPrecio("");
    setCalorias("");
    setInventario("");
    setTipo("");
  }

  useEffect(() => {
    obtenerIngredientes();
  }, []);

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Ingredientes
      </h1>

      <div className="bg-white p-4 rounded shadow mb-6">

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">

          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Calorías"
            value={calorias}
            onChange={(e) => setCalorias(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Inventario"
            value={inventario}
            onChange={(e) => setInventario(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border p-2 rounded"
          />

        </div>

        <div className="mt-4 flex gap-3">

          {idEditar ? (
            <>
              <button
                onClick={actualizarIngrediente}
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
              onClick={agregarIngrediente}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Guardar Ingrediente
            </button>
          )}

        </div>

      </div>

      <table className="w-full bg-white shadow rounded">

        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Calorías</th>
            <th className="p-2">Inventario</th>
            <th className="p-2">Tipo</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>

        <tbody>

          {ingredientes.map((ingrediente) => (
            <tr key={ingrediente.id}>

              <td className="border p-2">
                {ingrediente.id}
              </td>

              <td className="border p-2">
                {ingrediente.nombre}
              </td>

              <td className="border p-2">
                ${ingrediente.precio}
              </td>

              <td className="border p-2">
                {ingrediente.calorias}
              </td>

              <td className="border p-2">
                {ingrediente.inventario}
              </td>

              <td className="border p-2">
                {ingrediente.tipo}
              </td>

              <td className="border p-2">

                <div className="flex gap-2">

                  <button
                    onClick={() =>
                      cargarIngrediente(ingrediente)
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      eliminarIngrediente(ingrediente.id)
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>

                </div>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Ingredientes;
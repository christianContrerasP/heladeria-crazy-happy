import { createClient } from "@supabase/supabase-js";

// Obtener credenciales desde .env.local
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar que las credenciales existan
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    " Falta configurar VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env.local"
  );
}

// Crear y exportar el cliente de Supabase
// Este objeto es lo que usaremos para hablar con la base de datos
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log("Supabase conectado correctamente");
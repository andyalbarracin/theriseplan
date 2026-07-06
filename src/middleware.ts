/* =============================================================================
   Archivo:     middleware.ts
   Ruta:        web/src/middleware.ts
   Modificado:  2026-07-06
   Descripcion: Puerta de entrada al panel. Se ejecuta antes de servir cualquier
                ruta /dashboard/*: refresca la sesion de Supabase y, si no hay
                usuario logueado, redirige a /login.

                Si Supabase NO esta configurado (sin credenciales), no bloquea
                nada: el panel queda abierto como demo/mock.

                Para cambiar que rutas protege, editar `config.matcher` abajo.
   ============================================================================= */
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Sin credenciales → modo demo: no se protege el panel.
  if (!url || !key) return res;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  // getUser() valida el token con Supabase (mas seguro que leer la cookie a mano).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

// Solo corre en el panel. El resto del sitio (publico) no pasa por aca.
export const config = {
  matcher: ["/dashboard/:path*"],
};

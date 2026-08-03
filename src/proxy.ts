import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Portail mot de passe pour l'app publique (mono-utilisateur).
// Next.js 16 : ce fichier s'appelle « proxy » (ex-« middleware »).
//
// Actif UNIQUEMENT si APP_PASSWORD est défini. En dev local sans la variable,
// aucune authentification n'est demandée — la friction zéro est préservée.
// Sur Vercel, définissez APP_PASSWORD pour verrouiller l'accès public.
export function proxy(request: NextRequest) {
  const password = process.env.APP_PASSWORD;
  if (!password) return NextResponse.next();

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    // "Basic base64(user:pass)" — l'utilisateur est ignoré, seul le mot de passe compte.
    const decoded = atob(auth.slice(6));
    const pass = decoded.slice(decoded.indexOf(":") + 1);
    if (pass === password) return NextResponse.next();
  }

  return new NextResponse("Authentification requise.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Zhongwen Master"' },
  });
}

// S'applique à tout sauf aux assets statiques.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

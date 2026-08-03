import { prisma } from "./db";

// Application mono-utilisateur (PRD §1) : pas d'authentification,
// l'utilisateur unique est créé par le seed.
export async function getUser() {
  const user = await prisma.user.findFirst();
  if (!user) {
    throw new Error("Aucun utilisateur en base — lancez `npm run db:seed`.");
  }
  return user;
}

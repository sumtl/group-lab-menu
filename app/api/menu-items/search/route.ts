import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/menu-items/search:
 *   get:
 *     summary: Rechercher des plats par nom
 *     description: Recherche les plats dont le nom contient la chaîne fournie (insensible à la casse).
 *     tags:
 *       - Menu Items
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *         description: Nom (ou partie du nom) du plat à rechercher
 *     responses:
 *       200:
 *         description: Liste des plats trouvés
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MenuItem'
 *       400:
 *         description: Paramètre name manquant ou vide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Paramètre name manquant ou vide"
 *       500:
 *         description: Erreur serveur lors de la recherche
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de la recherche des plats"
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get("name");
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Paramètre name manquant ou vide" },
        { status: 400 }
      );
    }
    const nameLower = name.toLowerCase();
    const menuItems = await prisma.menuItem.findMany({
      where: {
        name: {
          contains: nameLower,
        },
      },
    });
    return NextResponse.json(
      { success: true, data: menuItems },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la recherche des plats:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la recherche des plats" },
      { status: 500 }
    );
  }
}

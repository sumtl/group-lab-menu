import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/menu-items:
 *   get:
 *     summary: Récupérer tous les plats
 *     description: Récupère une liste de tous les plats disponibles dans le menu.
 *     tags:
 *       - Menu Items
 *     responses:
 *       200:
 *         description: Liste des plats récupérée avec succès
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
 *                 message:
 *                   type: string
 *                   example: "3 plat(s) trouvé(s)"
 *             examples:
 *               liste_vide:
 *                 summary: Liste vide
 *                 value:
 *                   success: true
 *                   data: []
 *                   message: "0 plat(s) trouvé(s)"
 *               liste_avec_plats:
 *                 summary: Liste avec des plats
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: 1
 *                       name: "Pizza"
 *                       createdAt: "2023-01-01T00:00:00Z"
 *                       updatedAt: "2023-01-01T00:00:00Z"
 *                     - id: 2
 *                       name: "Burger"
 *                       createdAt: "2023-01-01T00:00:00Z"
 *                       updatedAt: "2023-01-01T00:00:00Z"
 *                   message: "2 plat(s) trouvé(s)"
 *       500:
 *         description: Erreur lors de la récupération des plats
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
 *                   example: "Erreur lors de la récupération des plats"
 *             examples:
 *               erreur:
 *                 summary: Erreur lors de la récupération des plats
 *                 value:
 *                   success: false
 *                   error: "Erreur lors de la récupération des plats"
 */
export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({
      success: true,
      data: menuItems,
      message: `${menuItems.length} plat(s) trouvé(s)`,
    });
  } catch (error) {
    console.error("GET /api/menu-items error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des plats",
      },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/menu-items:
 *   post:
 *     summary: Ajouter un plat
 *     description: Ajoute un plat au menu. Le nom du plat est obligatoire.
 *     tags:
 *       - Menu Items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Pizza"

 *     responses:
 *       201:
 *         description: Plat ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MenuItem'
 *                 message:
 *                   type: string
 *                   example: "Plat ajouté avec succès"
 *             examples:
 *               success: true
 *               data:
 *                 id: 1
 *                 name: "Pizza"
 *                 createdAt: "2023-01-01T00:00:00Z"
 *                 updatedAt: "2023-01-01T00:00:00Z"
 *               message: "Plat ajouté avec succès"
 *       400:
 *         description: Données invalides
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
 *                   example: "Le nom du plat est obligatoire"
 *           examples:
 *             nom_manquant:
 *               summary: Nom du plat manquant
 *               value: 
 *                 success: false,
 *                 error: "Le nom du plat est obligatoire"
 *             nom_existant:
 *               summary: Nom du plat existant
 *               value: 
 *                 success: false,
 *                 error: "Un plat avec ce nom existe déjà"
 *       500:
 *         description: Erreur serveur lors de l'ajout du plat
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
 *                   example: "Erreurlors de l'ajout du plat"
 *           examples:
 *             erreur_serveur:
 *               summary: Erreur serveur
 *               value: {
 *                 success: false,
 *                 error: "Erreur lors de l'ajout du plat"
 *               }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        {
          success: false,
          error: "Le nom du plat est obligatoire",
        },
        { status: 400 }
      );
    }

    const existingMenuItem = await prisma.menuItem.findUnique({
      where: {
        name: body.name,
      },
    });

    if (existingMenuItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Un plat avec ce nom existe déjà",
        },
        { status: 400 }
      );
    }

    const newMenuItem = await prisma.menuItem.create({
      data: body,
    });
    return NextResponse.json(
      {
        success: true,
        data: newMenuItem,
        message: "Plat ajouté avec succès",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout du plat:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'ajout du plat",
      },
      { status: 500 }
    );
  }
}

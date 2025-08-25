import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/menu-items/{id}:
 *   get:
 *     summary: Récupérer un plat par ID
 *     description: Récupère un plat spécifique à partir de son ID.
 *     tags:
 *       - Menu Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du plat
 *     responses:
 *       200:
 *         description: Plat récupéré avec succès
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
 *                   example: "Plat récupéré avec succès"
 *       400:
 *         description: Données invalides (ID du plat)
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
 *                   example: "ID du plat invalide"
 *       404:
 *         description: Plat non trouvé
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
 *                   example: "Plat non trouvé"
 *       500:
 *         description: Erreur serveur
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
 *                   example: "Erreur lors de la récupération du plat"
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id) || id <= 0) {
    return NextResponse.json(
      { success: false, error: "ID du plat invalide" },
      { status: 400 }
    );
  }
  try {
    const menuItem = await prisma.menuItem.findUnique({ where: { id } });
    if (!menuItem) {
      return NextResponse.json(
        { success: false, error: "Plat non trouvé" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: menuItem,
        message: "Plat récupéré avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération du plat:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération du plat" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/menu-items/{id}:
 *   put:
 *     summary: Mettre à jour un plat par ID
 *     description: Met à jour les informations d'un plat spécifique à partir de son ID.
 *     tags:
 *       - Menu Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du plat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuItemInput'
 *     responses:
 *       200:
 *         description: Plat mis à jour avec succès
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
 *                   example: "Plat mis à jour avec succès"
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
 *                   example: "Le corps de la requête est invalide"
 *       404:
 *         description: Plat non trouvé
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
 *                   example: "Plat non trouvé"
 *       500:
 *         description: Erreur serveur
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
 *                   example: "Erreur lors de la mise à jour du plat"
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id) || id <= 0) {
    return NextResponse.json(
      { success: false, error: "ID du plat invalide" },
      { status: 400 }
    );
  }
  const body = await request.json();
  try {
    const existingMenuItem = await prisma.menuItem.findUnique({
      where: { id },
    });
    if (!existingMenuItem) {
      return NextResponse.json(
        { success: false, error: "Plat non trouvé" },
        { status: 404 }
      );
    }
    const updatedMenuItem = await prisma.menuItem.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(
      {
        success: true,
        data: updatedMenuItem,
        message: "Plat mis à jour avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour du plat:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour du plat" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/menu-items/{id}:
 *   delete:
 *     summary: Supprimer un plat par ID
 *     description: Supprime un plat spécifique à partir de son ID.
 *     tags:
 *       - Menu Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du plat
 *     responses:
 *       200:
 *         description: Plat supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: null
 *                 message:
 *                   type: string
 *                   example: "Plat supprimé avec succès"
 *       400:
 *         description: Données invalides (ID du plat)
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
 *                   example: "ID du plat invalide"
 *       404:
 *         description: Plat non trouvé
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
 *                   example: "Plat non trouvé"
 *       500:
 *         description: Erreur serveur
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
 *                   example: "Erreur lors de la suppression du plat"
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id) || id <= 0) {
    return NextResponse.json(
      { success: false, error: "ID du plat invalide" },
      { status: 400 }
    );
  }
  try {
    const existingMenuItem = await prisma.menuItem.findUnique({
      where: { id },
    });
    if (!existingMenuItem) {
      return NextResponse.json(
        { success: false, error: "Plat non trouvé" },
        { status: 404 }
      );
    }
    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json(
      {
        success: true,
        data: null,
        message: "Plat supprimé avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du plat:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la suppression du plat" },
      { status: 500 }
    );
  }
}

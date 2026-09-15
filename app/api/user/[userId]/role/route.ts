import { NextRequest, NextResponse } from "next/server";
import { checkUserPermission, getCurrentUser } from "../../../../lib/auth";
import { Role } from "../../../types";
import { prisma } from "../../../../lib/db";

export async function PATCH(request: NextRequest, context: { params: Promise<{ userId: string }> }) {

  try {
    const { userId } = await context.params
    const currentUser = await getCurrentUser()

    if (!currentUser || !checkUserPermission(currentUser, Role.ADMIN as Role)) {
      return NextResponse.json(
        { error: 'You are not authorized to update roles' },
        { status: 403 })
    }

    //Prevent user from changing there own id 
    if (userId === currentUser.id) {
      return NextResponse.json(
        { error: 'You cant change your own role' },
        { status: 403 })
    };


    const { role } = await request.json()
    const validRoles = [Role.MANAGER, Role.USER]

    if (!validRoles.includes(role)) {
      return NextResponse.json(
        {
          error: "Invalid role or you cann't have more then one ADMIN user"
        },
        {
          status: 400
        }
      );
    }
    // Updated user's team information 
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role,
      },
      include: {
        team: true
      }
    })
    return NextResponse.json({
      user: updatedUser,
      message: `User role updated successfully to ${role}`
    });
  } catch (error) {
    console.error("Team assignment error", error)
    if (error instanceof Error && error.message.includes("Record to update not found"))
      return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}

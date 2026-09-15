import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../lib/auth";
import { Prisma } from "../../generated/prisma/client";
import { Role } from "../types";
import { prisma } from "../../lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "You are not authorized to access user information" }, { status: 400 })
    }

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId")
    const teamId = searchParams.get("teamId")
    const role = searchParams.get("role")

    //Building where clause based on user role 
    const where: Prisma.UserWhereInput = {}

    if (user.role === "ADMIN") {
      // Admin can all the users 
    } else if (user.role === "MANAGER") {
      // Manager can see user in there taem and accross other teams but can't see as admin can
      where.OR = [{ teamId: user.teamId }, { role: Role.USER, teamId: user.teamId }
      ]
    } else {
      // Regular user can only see there team 
      where.teamId = user.teamId,
        where.role = { not: Role.ADMIN }
    }


    //Additional filters 

    if (teamId) {
      where.teamId = teamId
    }
    if (role) {
      where.role = role as Role
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        team: {
          select: {
            id: true,
            name: true
          }
        },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(users)


  } catch (error) {

    console.error("Get user error", error)
    return NextResponse.json({
      error: "Something went wrong when getting user information with user id",
    }, { status: 500 })
  }
}

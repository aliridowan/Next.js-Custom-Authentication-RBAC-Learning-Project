import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { genareteToken, hashPassword } from "../../../lib/auth";
import { Role } from "../../types";


export async function POST(request: NextRequest) {
  try {

    const { name, email, password, teamCode } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: "username email & password are required"
        },
        { status: 400 }
      )
    };

    const findExixtingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (findExixtingUser) {
      return NextResponse.json(
        {
          error: "User with this email already exixts"
        },
        {
          status: 409
        }
      )
    }

    let teamId: string | undefined;

    if (teamCode) {
      const team = await prisma.team.findUnique({
        where: { code: teamCode }
      })
      if (!team) {
        return NextResponse.json(
          {
            error: "Please enter a valid teamcode"
          },
          {
            status: 400
          }
        );
      }
      teamId = team.id
    }

    const hashedPassword = await hashPassword(password)

    // First user become a Admin and others become user 
    const userCount = await prisma.user.count()

    const role = userCount === 0 ? Role.ADMIN : Role.USER

    const user = await prisma.user.create(
      {
        data: {
          name,
          email,
          password: hashedPassword,
          teamId,
          role,
        },
        include: {
          team: true,
        },
      }
    );
    //Genarete token 
    const token = genareteToken(user.id)
    // Response

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          teamId: user.teamId,
          team: user.team,
          token,
        },
      }
    );
    // set cookies 
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7
    })

    return response
  } catch (error) {
    console.error("Registration failed", error);
    return NextResponse.json(
      {
        error: "Internal server error"
      },
      { status: 500 })

  }
}

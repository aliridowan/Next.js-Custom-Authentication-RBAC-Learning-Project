import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { genareteToken, verifypassword } from "../../../lib/auth";


export async function POST(request: NextRequest) {
  try {

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "username email & password are required"
        },
        { status: 400 }
      )
    };

    const userFromDb = await prisma.user.findUnique({
      where: { email }
    })

    if (!userFromDb) {
      return NextResponse.json(
        {
          error: "Invalid user credentials"
        },
        {
          status: 401
        }
      )
    }


    const verifyedPassword = await verifypassword(password, userFromDb.password)

    if (!verifyedPassword) {
      return NextResponse.json({
        error: "Invalid credentials"
      }, { status: 400 })
    }

    // First user become a Admin and others become user 

    // const userCount = await prisma.user.count()
    // const role = userCount === 0 ? Role.ADMIN : Role.USER

    const token = genareteToken(userFromDb.id)
    // Response

    const response = NextResponse.json(
      {
        user: {
          id: userFromDb.id,
          email: userFromDb.email,
          name: userFromDb.name,
          role: userFromDb.role,
          teamId: userFromDb.teamId,
          // team: userFromDb.team,
          // token, the user doeesn't need to see the token in the response 
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
    console.error("Login failed", error);
    return NextResponse.json(
      {
        error: "Internal server error"
      },
      { status: 500 })

  }
}

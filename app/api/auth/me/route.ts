import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({
        error: "You are not authenticated login first"
      }, { status: 401 })
    }
    return NextResponse.json(user)
  } catch (error) {
    console.error("error showing me route", error)
    return NextResponse.json({
      error: "Ineternal server error while showing the me route"
    }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server";
import { checkUserPermission, getCurrentUser } from "../../../../lib/auth";
import { Role } from "../../../types";
import { prisma } from "../../../../lib/db";

export async function PATCH(request: NextRequest, context: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await context.params;
    const user = await getCurrentUser();

    if (!user || !checkUserPermission(user, Role.ADMIN as Role)) {
      return NextResponse.json({ error: 'You are not authorized to assign team' }, { status: 403 });
    }

    const { teamId } = await request.json();

    // Handle the null case (removing from team)
    if (teamId === null || teamId === undefined) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { teamId: null },
        include: { team: true },
      });
      return NextResponse.json({ user: updatedUser, message: "User removed from team successfully" });
    }

    // Validate the team exists
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },  // ← use userId, not teamId
      data: { teamId },
      include: { team: true },
    });

    return NextResponse.json({ user: updatedUser, message: "User added to team successfully" });

  } catch (error) {
    console.error("Team assignment error", error);
    if (error instanceof Error && error.message.includes("Record to update not found"))
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


// import { NextRequest, NextResponse } from "next/server";
// import { checkUserPermission, getCurrentUser } from "../../../../lib/auth";
// import { Role } from "../../../types";
// import { error } from "console";
// import { prisma } from "../../../../lib/db";
//
// export async function PATCH(request: NextRequest, context: { params: Promise<{ userId: string }> }) {
//
//   try {
//     const { userId } = await context.params
//     const user = await getCurrentUser()
//     if (!user || !checkUserPermission(user, Role.ADMIN as Role)) {
//       return NextResponse.json({ error: 'You are not authorized to assign team' }, { status: 409 })
//     }
//
//     const { teamId } = await request.json()
//
//     if (teamId) {
//       const team = await prisma.user.findUnique({
//         where: { id: teamId }
//       })
//       if (!team) {
//         return NextResponse.json(
//           {
//             error: "Team not found "
//           },
//           {
//             status: 404
//           }
//         );
//       }
//       // Updated user's team information 
//       const updatedUser = await prisma.user.update({
//         where: { id: teamId },
//         data: {
//           teamId: teamId,
//         },
//         include: {
//           team: true
//         }
//       })
//       return NextResponse.json({
//         user: updatedUser,
//         message: teamId ? "User added to team successfully" : "User Removed from team successfully"
//       })
//     }
//
//
//   } catch (error) {
//     console.error("Team assignment error", error)
//     if (error instanceof Error && error.message.includes("Record to update not found"))
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//   }
//   return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//
// }

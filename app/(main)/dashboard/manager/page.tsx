import { redirect } from "next/navigation"
import { Role } from "../../../api/types"
import { checkUserPermission, getCurrentUser } from "../../../lib/auth"
import { prisma } from "../../../lib/db"
import ManagerDashboard from "../../../components/dashboard/Managerdashboard"
import { transformUsers } from '../../../../lib/util'

async function ManagerPage() {
  const user = await getCurrentUser()
  if (!user || !checkUserPermission(user, Role.MANAGER)) {
    redirect('/unauthorized')
  }

  const [prismaMyTeamMembers, prismaAllTeamMembers] = await Promise.all([
    // Manager's own team members
    user.teamId
      ? prisma.user.findMany({
        where: {
          teamId: user.teamId,
          role: { not: Role.ADMIN }
        },
        include: {
          team: true    // ✅ matches PrismaUser type
        },
      })
      : Promise.resolve([]),

    // Cross-team view — all non-admin users
    prisma.user.findMany({
      where: {
        role: { not: Role.ADMIN }
      },
      include: {
        team: true        // ✅ changed from select to plain true
      },
      orderBy: {
        teamId: 'desc'
      }
    })
  ])

  const myTeamMembers = transformUsers(prismaMyTeamMembers)
  const allTeamMembers = transformUsers(prismaAllTeamMembers)

  return (
    <ManagerDashboard
      myTeamMembers={myTeamMembers}
      allTeamMembers={allTeamMembers}
      currentUser={user}
    />
  )
}

export default ManagerPage


// import { redirect } from "next/navigation"
// import { Role } from "../../../api/types"
// import { checkUserPermission, getCurrentUser } from "../../../lib/auth"
// import { prisma } from "../../../lib/db"
// import ManagerDashboard from "../../../components/dashboard/Managerdashboard"
//
// async function ManagerPage() {
//   const user = await getCurrentUser()
//   if (!user || !checkUserPermission(user, Role.MANAGER)) {
//     redirect('/unauthorized')
//   }
//
//   // fetch manager own team members 
//
//   const prismaMyTeamMembers = user.teamId ?
//     await prisma.user.findMany({
//       where: {
//         teamId: user.teamId,
//         role: { not: Role.ADMIN }
//       },
//       include: {
//         team: true
//       },
//     }) : []
//
//   // fetch all team members (cross view team exclude sensetive inforamtion)
//   const prismaAllTeamMembers = await prisma.user.findMany({
//     where: {
//       role: { not: Role.ADMIN }
//     },
//     include: {
//       team: {
//         select: {
//           id: true,
//           name: true,
//           code: true,
//           description: true,
//         }
//       }
//     },
//     orderBy: {
//       teamId: 'desc'
//     }
//   })
//
//   return (
//     <ManagerDashboard myTeamMembers={prismaMyTeamMembers} allTeamMembers={prismaAllTeamMembers} currentUser={user} />
//   )
//
// }
//
// export default ManagerPage

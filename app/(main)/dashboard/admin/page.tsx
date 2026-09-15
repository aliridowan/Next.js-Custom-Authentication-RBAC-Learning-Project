import { redirect } from "next/navigation"
import { Role } from "../../../api/types"
import { checkUserPermission, getCurrentUser } from "../../../lib/auth"
import { prisma } from "../../../lib/db"
import AdminDashborad from "../../../components/dashboard/AdminDashborad"
import { transformUsers, transformTeams } from '../../../../lib/util'

async function AdminPage() {
  const user = await getCurrentUser()
  if (!user || !checkUserPermission(user, Role.ADMIN)) {
    redirect('/unauthorized')
  }

  const [prismaUsers, prismaTeams] = await Promise.all([
    prisma.user.findMany({
      include: {
        team: true        // ✅ matches PrismaUser type in util.ts
      },
      orderBy: {
        createdAt: 'desc'
      },
    }),

    prisma.team.findMany({
      include: {
        members: true     // ✅ changed from select to include — matches PrismaTeam type in util.ts
      }
    })
  ])

  const users = transformUsers(prismaUsers)
  const teams = transformTeams(prismaTeams)

  return (
    <AdminDashborad users={users} teams={teams} currentUser={user} />
  )
}

export default AdminPage


// import { redirect } from "next/navigation"
// import { Role } from "../../../api/types"
// import { checkUserPermission, getCurrentUser } from "../../../lib/auth"
// import { prisma } from "../../../lib/db"
// import AdminDashborad from "../../../components/dashboard/AdminDashborad"
// import { transformUser, transformUsers, transformTeam, transformTeams } from '../../../../lib/util'
//
// // After fetching:
//
// return <AdminDashborad users={users} teams={teams} currentUser={user} />
//
//
// async function AdminPage() {
//   const user = await getCurrentUser()
//   if (!user || !checkUserPermission(user, Role.ADMIN)) {
//     redirect('/unauthorized')
//   }
//
//   // fetch data for  admin dashboard
//   const [prismaUsers, prismaTeams] = await Promise.all(
//     [
//       prisma.user.findMany({
//         include: {
//           team: true
//         },
//         orderBy: {
//           createdAt: 'desc'
//         },
//
//       }),
//
//       prisma.team.findMany({
//         include: {
//           members: {
//             select: {
//               id: true,
//               name: true,
//               role: true,
//               email: true,
//             }
//           }
//         }
//       })
//
//     ]
//   )
//
//   const users = transformUsers(prismaUsers)      // converts Prisma[] → User[]
//   const teams = transformTeams(prismaTeams)      // converts Prisma[] → Team[]
//   const currentUser = transformUser(user)         // wait — getCurrentUser already returns User
//
//   return (
//     <AdminDashborad users={prismaUsers} teams={prismaTeams} currentUser={user} />
//   )
// }
// export default AdminPage
//
//
//

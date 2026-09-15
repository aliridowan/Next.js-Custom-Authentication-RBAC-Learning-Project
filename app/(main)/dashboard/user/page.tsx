import { redirect } from "next/navigation"
import { getCurrentUser } from "../../../lib/auth"
import { prisma } from "../../../lib/db"
import { Role } from "../../../api/types"
import UserDashboard from "../../../components/dashboard/Userdashboard"
import { transformUsers } from '../../../../lib/util'

async function UserPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  if (!user.teamId) {
    return <UserDashboard teamMembers={[]} currentUser={user as any} />
  }

  const teamMembers = await prisma.user.findMany({
    where: {
      teamId: user.teamId,
      role: { not: Role.ADMIN }
    },
    include: {       // ← changed from select to include
      team: true     // ← this matches PrismaUser type in util.ts exactly
    },
    orderBy: { createdAt: 'desc' }
  })

  const members = transformUsers(teamMembers)

  return (
    <UserDashboard teamMembers={members} currentUser={user as any} />
  )
}

export default UserPage


// import { redirect } from "next/navigation"
// import { getCurrentUser } from "../../../lib/auth"
// import { prisma } from "../../../lib/db"
// import UserDashboard from "../../../components/dashboard/UserDashboard"
//
// async function UserPage() {
//   const user = await getCurrentUser()
//   if (!user) {
//     redirect('/login')
//   }
//
//   // fetch manager own team members 
//
//   const teamMembers = user.teamId ?
//     await prisma.user.findMany({
//       where: {
//         teamId: user.teamId,
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//
//       },
//     }) : []
//
//   return (
//     <UserDashboard teamMembers={teamMembers} currentUser={user} />
//   )
// }
//
//
//
// export default UserPage


// import { redirect } from "next/navigation"
// import { getCurrentUser } from "../../../lib/auth"
// import { prisma } from "../../../lib/db"
// import UserDashboard from "../../../components/dashboard/Userdashboard"
//
// async function UserPage() {
//   const user = await getCurrentUser()
//   if (!user) {
//     redirect('/login')
//   }
//
//   // fetch manager own team members 
//
//   const teamMembers = user.teamId ?
//     await prisma.user.findMany({
//       where: {
//         teamId: user.teamId,
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//
//       },
//     }) : []
//
//   return (
//     <UserDashboard teamMembers={teamMembers} currentUser={user} />
//   )
// }
//
//
//
// export default UserPage

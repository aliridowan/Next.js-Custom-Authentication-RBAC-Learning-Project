import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";
import { Role } from "../../api/types";

async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  switch (user.role) {
    case Role.ADMIN:
      redirect('/dashboard/admin')
    case Role.MANAGER:
      redirect('/dashboard/manager')
    case Role.USER:
      redirect('/dashboard/user')
    default:
      redirect('/dashboard/user')
  }
}

export default DashboardPage


// import { redirect } from "next/navigation";
// import { getCurrentUser } from "../../lib/auth";
// import { Role } from "../../api/types";
//
//
// async function DashboardLayout() {
//   try {
//     const user = await getCurrentUser()
//     if (!user) {
//       redirect('/login')
//     }
//     // Redirect user based on their role 
//     switch (user.role) {
//       case Role.ADMIN:
//         redirect('/dashboard/admin')
//       case Role.MANAGER:
//         redirect('/dashboard/manager')
//       case Role.USER:
//         redirect('/dashboard/user')
//
//       default:
//         redirect('/dashboard/user')
//     }
//
//   } catch (error) {
//
//   }
//   return (
//     <div>
//
//     </div>
//   )
// }
//
// export default DashboardLayout

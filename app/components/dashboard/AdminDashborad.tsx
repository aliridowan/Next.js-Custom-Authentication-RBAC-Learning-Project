'use client'
import { Role, Team, User } from "../../api/types"
import { useTransition } from 'react'
import { apiClient } from "../../lib/apiClient"
import { useRouter } from "next/navigation"

interface AdminDashboradProps {
  users: User[],
  teams: Team[],
  currentUser: User,
}


function AdminDashborad({ users, teams, currentUser }: AdminDashboradProps) {
  const router = useRouter()
  const [isPending, startTansition] = useTransition()
  const handleTeamAssingment = async (userId: string, teamId: string | null) => {
    startTansition(async () => {
      try {
        await apiClient.updateUserTeam(userId, teamId)
        router.refresh()
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Error Updating user Team')
      }
    })

  }

  const handleRoleAssingment = async (userId: string, newRole: Role) => {
    if (userId === currentUser.id) {

      alert('You can not change your own id')
      return
    }
    try {
      await apiClient.updateUserRole(userId, newRole)
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error Updating user Role')

    }

  }

  return (
    <div className="spay-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">ADMIN DASHBOARD</h1>
        <p className="text-slate-300">USER AND TEAM MANAGMENT </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* user table with role and team assingment  */}
        <div className="bg-slate-950 border border-slate-800 rounded">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">Users ({users.length})</h3>
            <p className="text-slate-400 text-sm">Manage roles and team assingment</p>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 ">
                  <th className="text-left py-2 text-slate-300">Name</th>
                  <th className="text-left py-2 text-slate-300">Role</th>
                  <th className="text-left py-2 text-slate-300">Team</th>
                  <th className="text-left py-2 text-slate-300">Action</th>
                </tr>
              </thead>
              <tbody >
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700">
                    <td className="py-2 text-slate-300">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div>{user.name}</div>
                          <div>{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-2">
                      <select value={user.role} onChange={(e) => handleRoleAssingment(user.id, e.target.value as Role)}
                        disabled={isPending || user.id === currentUser.id} className="text-white">
                        <option value={Role.USER}>USER</option>
                        <option value={Role.ADMIN}>ADMIN</option>
                        <option value={Role.MANAGER}>MANAGER</option>
                      </select>
                    </td>
                    <td className="py-2">
                      <select value={user.teamId || ''} onChange={(e) => handleTeamAssingment(user.id, e.target.value || null)}
                        disabled={isPending} className="text-white">
                        <option value="">NO TEAM</option>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                      </select>
                      {user.team && (<span className="text-white">{user.team.code}</span>)}
                    </td>
                    <td className="py-2">
                      {user.teamId && (
                        <button onClick={() => handleTeamAssingment(user.id, null)} className="text-red-300" > Remove</button>
                      )}

                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
        {/* teams table  */}
        <div className="bg-slate-950 border border-slate-800 rounded">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">Teams ({teams.length})</h3>
            <p className="text-slate-400 text-sm">Teams Oveer View</p>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 ">
                  <th className="text-left py-2 text-slate-300">Name</th>
                  <th className="text-left py-2 text-slate-300">Code</th>
                  <th className="text-left py-2 text-slate-300">Members</th>
                  <th className="text-left py-2 text-slate-300">Managers</th>
                </tr>
              </thead>
              <tbody className="py-2">
                {
                  teams.map((team) => {
                    const teamMembers = users.filter((user) => user.teamId === team.id);
                    const teamManagers = teamMembers.filter((user) => user.role === Role.MANAGER);
                    return (
                      <tr key={team.id} className="border-b text-slate-700">
                        <td className="py-2 text-slate-300">{team.name}</td>
                        <td className="py-2 text-blue-500">{team.code}</td>
                        <td className="py-2 text-slate-300">{teamMembers.length} Users</td>
                        <td> {teamMembers.length > 0 ? <div className="text-green-300 flex flex-wrap gap-1">
                          {teamManagers.map((manager) => <span key={manager.id} title={manager.name} >
                            {manager.name}
                          </span>)}
                        </div> : <span className="text-green-300 text-xs">No manager</span>}</td>
                      </tr>

                    )
                  })
                }

              </tbody>
            </table>
          </div>
        </div>
        {/* stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-black border border-slate-700 rounded-lg p-4 text-center">
            <div className="text-2xl text-center text-white">{users.length}</div>
            <div className="text-sm text-center text-white">Total users</div>
          </div>

          <div className="bg-black border border-slate-700 rounded-lg p-4 text-center">
            <div className="text-2xl text-center text-white">{users.filter((u) => u.role === Role.ADMIN).length}</div>
            <div className="text-sm text-center text-white">Admin</div>
          </div>

          <div className="bg-black border border-slate-700 rounded-lg p-4 text-center">
            <div className="text-2xl text-center text-white">{users.filter((u) => u.role === Role.MANAGER).length}</div>
            <div className="text-sm text-center text-white">Managers</div>
          </div>

          <div className="bg-black border border-slate-700 rounded-lg p-4 text-center">
            <div className="text-2xl text-center text-white">{users.filter((u) => u.role === Role.USER).length}</div>
            <div className="text-sm text-center text-white">Users</div>
          </div>

          <div className="bg-black border border-slate-700 rounded-lg p-4 text-center">
            <div className="text-2xl text-center text-white">{teams.length}</div>
            <div className="text-sm text-center text-white">Teams</div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AdminDashborad

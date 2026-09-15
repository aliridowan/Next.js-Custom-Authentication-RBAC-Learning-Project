'use client'
import { Role, User } from "../../api/types"

interface UserDashboardProps {
  teamMembers: User[]
  currentUser: User
}

const roleBadgeColor: Record<Role, string> = {
  [Role.ADMIN]: 'bg-red-900/40 text-red-300 border border-red-700',
  [Role.MANAGER]: 'bg-purple-900/40 text-purple-300 border border-purple-700',
  [Role.USER]: 'bg-blue-900/40 text-blue-300 border border-blue-700',
  [Role.GUEST]: 'bg-slate-700 text-slate-300 border border-slate-600',
}

function UserDashboard({ teamMembers, currentUser }: UserDashboardProps) {
  const managers = teamMembers.filter(m => m.role === Role.MANAGER)
  const regularUsers = teamMembers.filter(m => m.role === Role.USER)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">My Dashboard</h1>
        <p className="text-slate-400 text-sm">Welcome back, <span className="text-slate-200 font-medium">{currentUser.name}</span></p>
      </div>

      {/* Current user info card */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
          {currentUser.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold">{currentUser.name}</div>
          <div className="text-slate-400 text-sm truncate">{currentUser.email}</div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleBadgeColor[currentUser.role]}`}>
          {currentUser.role}
        </span>
      </div>

      {currentUser.teamId ? (
        <div className="space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{teamMembers.length}</div>
              <div className="text-slate-400 text-xs mt-1">Team Members</div>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-300">{managers.length}</div>
              <div className="text-slate-400 text-xs mt-1">Managers</div>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-300">{regularUsers.length}</div>
              <div className="text-slate-400 text-xs mt-1">Users</div>
            </div>
          </div>

          {/* Team members table */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <h3 className="font-semibold text-white">My Team</h3>
              <p className="text-slate-400 text-sm">People in your team</p>
            </div>
            <div className="p-4">
              {teamMembers.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">No other members in your team yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-2 text-slate-400 font-medium">Member</th>
                      <th className="text-left py-2 text-slate-400 font-medium">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => (
                      <tr key={member.id} className="border-b border-slate-800 last:border-0">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-white font-medium flex items-center gap-2">
                                {member.name}
                                {member.id === currentUser.id && (
                                  <span className="text-xs text-slate-500">(you)</span>
                                )}
                              </div>
                              <div className="text-slate-500 text-xs">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${roleBadgeColor[member.role]}`}>
                            {member.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">👥</div>
          <h3 className="text-white font-semibold mb-1">You're not in a team yet</h3>
          <p className="text-slate-400 text-sm">Ask your admin to assign you to a team, or register with a team code.</p>
        </div>
      )}
    </div>
  )
}

export default UserDashboard

'use client'
import { Role, User } from "../../api/types"

interface ManagerDashboardProps {
  myTeamMembers: User[]
  allTeamMembers: User[]
  currentUser: User
}

const roleBadgeColor: Record<Role, string> = {
  [Role.ADMIN]: 'bg-red-900/40 text-red-300 border border-red-700',
  [Role.MANAGER]: 'bg-purple-900/40 text-purple-300 border border-purple-700',
  [Role.USER]: 'bg-blue-900/40 text-blue-300 border border-blue-700',
  [Role.GUEST]: 'bg-slate-700 text-slate-300 border border-slate-600',
}

// Group allTeamMembers by their team
function groupByTeam(members: User[]) {
  const groups: Record<string, { teamName: string; teamCode: string; members: User[] }> = {}
  const noTeam: User[] = []

  for (const member of members) {
    if (!member.teamId || !member.team) {
      noTeam.push(member)
      continue
    }
    if (!groups[member.teamId]) {
      groups[member.teamId] = {
        teamName: (member.team as any).name,
        teamCode: (member.team as any).code,
        members: [],
      }
    }
    groups[member.teamId].members.push(member)
  }

  return { groups, noTeam }
}

function ManagerDashboard({ myTeamMembers, allTeamMembers, currentUser }: ManagerDashboardProps) {
  const myManagers = myTeamMembers.filter(m => m.role === Role.MANAGER)
  const myUsers = myTeamMembers.filter(m => m.role === Role.USER)
  const { groups, noTeam } = groupByTeam(allTeamMembers)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Manager Dashboard</h1>
        <p className="text-slate-400 text-sm">
          Welcome, <span className="text-slate-200 font-medium">{currentUser.name}</span>
          {(currentUser as any).team && (
            <span className="ml-2 text-xs text-purple-300 bg-purple-900/30 border border-purple-700 px-2 py-0.5 rounded-full">
              {(currentUser as any).team.name}
            </span>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{myTeamMembers.length}</div>
          <div className="text-slate-400 text-xs mt-1">My Team</div>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-300">{myManagers.length}</div>
          <div className="text-slate-400 text-xs mt-1">Managers</div>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-300">{myUsers.length}</div>
          <div className="text-slate-400 text-xs mt-1">Users</div>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-300">{Object.keys(groups).length}</div>
          <div className="text-slate-400 text-xs mt-1">Total Teams</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* My Team Members */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">My Team Members</h3>
            <p className="text-slate-400 text-sm">People you manage directly</p>
          </div>
          <div className="p-4">
            {myTeamMembers.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-slate-500 text-sm">
                  {currentUser.teamId
                    ? "No members in your team yet."
                    : "You are not assigned to a team yet."}
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 text-slate-400 font-medium">Member</th>
                    <th className="text-left py-2 text-slate-400 font-medium">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {myTeamMembers.map((member) => (
                    <tr key={member.id} className="border-b border-slate-800 last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium flex items-center gap-1.5">
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

        {/* Cross-team view — all teams */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">All Teams Overview</h3>
            <p className="text-slate-400 text-sm">Cross-team visibility (admins hidden)</p>
          </div>
          <div className="p-4 space-y-4 max-h-[480px] overflow-y-auto">
            {Object.entries(groups).map(([teamId, group]) => (
              <div key={teamId}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-medium text-sm">{group.teamName}</span>
                  <span className="text-xs text-blue-400 bg-blue-900/30 border border-blue-700 px-1.5 py-0.5 rounded font-mono">
                    {group.teamCode}
                  </span>
                  <span className="text-slate-500 text-xs ml-auto">{group.members.length} member{group.members.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-1 pl-2 border-l border-slate-700">
                  {group.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-slate-300 text-xs">{member.name}</span>
                          <span className="text-slate-600 text-xs ml-1.5">{member.email}</span>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${roleBadgeColor[member.role]}`}>
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {noTeam.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-slate-400 font-medium text-sm">No Team</span>
                  <span className="text-slate-500 text-xs ml-auto">{noTeam.length} member{noTeam.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-1 pl-2 border-l border-slate-700">
                  {noTeam.map((member) => (
                    <div key={member.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-400 text-xs">{member.name}</span>
                      </div>
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${roleBadgeColor[member.role]}`}>
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(groups).length === 0 && noTeam.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-6">No users found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagerDashboard

import { Prisma } from "../app/generated/prisma/client";
import { Team, User } from "../app/api/types";

type PrismaUser = Prisma.UserGetPayload<{
  include: {
    team: true;
  };
}>;

type PrismaTeam = Prisma.TeamGetPayload<{
  include: {
    members: true;
  };
}>;

export function transformUser(prismaUser: PrismaUser): User {
  return {
    id: prismaUser.id,
    name: prismaUser.name,
    email: prismaUser.email,
    role: prismaUser.role as User['role'],
    teamId: prismaUser.teamId ?? undefined,
    createdAt: prismaUser.createdAt,
    updatedAt: prismaUser.updatedAt,
    team: prismaUser.team
      ? {
        id: prismaUser.team.id,
        name: prismaUser.team.name,
        code: prismaUser.team.code,
        description: prismaUser.team.description ?? undefined,
        members: [],
        createdAt: prismaUser.team.createdAt,
        updatedAt: prismaUser.team.updatedAt,
      }
      : undefined,
  }
}

export function transformUsers(users: PrismaUser[]): User[] {
  return users.map(transformUser)
}

export function transformTeam(prismaTeam: PrismaTeam): Team {
  return {
    id: prismaTeam.id,
    name: prismaTeam.name,
    code: prismaTeam.code,
    description: prismaTeam.description ?? undefined,
    members: prismaTeam.members.map((member) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role as User['role'],
      teamId: member.teamId ?? undefined,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    })),
    createdAt: prismaTeam.createdAt,
    updatedAt: prismaTeam.updatedAt,
  }
}

export function transformTeams(teams: PrismaTeam[]): Team[] {
  return teams.map(transformTeam)
}


// import { Prisma } from "../app/generated/prisma/client";
// import { Team, User } from "../app/api/types";
//
// type PrismaUser = Prisma.UserGetPayload<{
//   include: {
//     team: true;
//   };
// }>;
//
// type PrismaTeam = Prisma.TeamGetPayload<{
//   include: {
//     members: true;
//   };
// }>;
//
// export function transformUser(user: PrismaUser): User {
//   return {
//     id: user.id,
//     email: user.email,
//     name: user.name,
//     role: user.role,
//     teamId: user.teamId ?? undefined,
//     team: user.team ?? undefined,
//     createdAt: user.createdAt,
//     updatedAt: user.updatedAt,
//   };
// }
//
// export function transformUsers(users: PrismaUser[]): User[] {
//   return users.map(transformUser);
// }
//
// export function transformTeam(team: PrismaTeam): Team {
//   return {
//     id: team.id,
//     name: team.name,
//     description: team.description ?? undefined,
//     code: team.code,
//     members: team.members ?? [],
//     createdAt: team.createdAt,
//     updatedAt: team.updatedAt,
//   };
// }
//
// export function transformTeams(teams: PrismaTeam[]): Team[] {
//   return teams.map(transformTeam);
// }

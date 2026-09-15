# Next.js Custom Authentication & RBAC Engine (Learning Project)

> This is a from-scratch learning project built specifically to understand the "under the hood" mechanics of authentication and authorization. It serves as the architectural foundation that led to the production-grade [BetterAuth](https://better-auth.com/) implementation in my flagship e-commerce platform, [GadgetBroo](https://github.com/ridowan/gadgetbroo).

## 🎯 Motivation: Why I Built This

Before integrating modern, abstracted authentication libraries (like BetterAuth, NextAuth/Auth.js, or Clerk) into production apps, I wanted to understand exactly what those libraries are doing behind the scenes.

Instead of blindly installing an npm package, I built this project to answer three core engineering questions:

1. **How do JWTs and Cookies actually work together** to maintain secure user sessions?
2. **How does middleware intercept and protect routes** before hitting the server?
3. **How is data safely scoped at the database level** based on a user's role hierarchy?

By building this manual implementation using raw `bcryptjs`, `jsonwebtoken`, and Next.js APIs, I gained a deep, low-level understanding of web security, which allowed me to implement a much more advanced, granular RBAC system in my main project.

---

## 🏗️ How It Works (System Architecture)

This project implements a **Hierarchical Role-Based Authorization** system.

### 1. The Role Hierarchy

Instead of treating all roles equally, the system uses a mathematical hierarchy for permission inheritance.

```typescript
const roleHierarchy = { 
  GUEST: 0, 
  USER: 1, 
  MANAGER: 2, 
  ADMIN: 3 
};
```

If a route requires `MANAGER` access, the system checks `roleHierarchy[user.role] >= roleHierarchy[Role.MANAGER]`, meaning an `ADMIN` automatically inherits access without needing duplicate logic.

### 2. Multi-Tenant Data Scoping

Security doesn't just stop at the UI. The strongest feature of this project is how it dynamically alters database queries based on the user's role.

- **Admin:** Can query and view all users and teams across the database.
- **Manager:** The Prisma `where` clause dynamically scopes queries so managers can only fetch data belonging to their specific `teamId`.
- **User/Guest:** Strictly limited data access.

### 3. The Authentication Flow

- **Password Hashing:** Passwords are salted and hashed using `bcryptjs` before entering the PostgreSQL database.
- **Stateless Sessions:** Upon login, a JWT is signed with a secret and embedded into a Next.js HTTP-only cookie.
- **Middleware Protection:** Next.js Edge Middleware (`middleware.ts`) intercepts requests to `/dashboard/*`, parsing cookies to prevent unauthenticated access before server resources are consumed.
- **Server-Side Enforcement:** React Server Components (RSC) and Server Actions extract the user from the JWT on the server to prevent client-side bypassing.

---

## 🛠️ Tech Stack Used

- **Framework:** Next.js (App Router, Server Components, Server Actions)
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Security:** `jsonwebtoken` (JWT), `bcryptjs`
- **Language:** TypeScript

---

## 🚀 Key Takeaways

Building this taught me that authentication is easy to get wrong. Handling token expiration, secure cookie configuration, cross-site scripting (XSS) protections, and granular resource-level permissions require massive overhead if done manually.

**This exercise perfectly justified the use of standard authentication libraries in my main projects**, while giving me the underlying knowledge to debug those libraries effectively when edge-cases arise.

import { db } from "@/lib/db"

// ─── Posts ────────────────────────────────────────────────────────

export async function getAdminPosts() {
  return db.post.findMany({
    where:   { deletedAt: null },
    include: { author: { select: { name: true, email: true } }, category: true, tags: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function getAdminPostById(id: string) {
  return db.post.findFirst({
    where:   { id, deletedAt: null },
    include: { category: true, tags: true },
  })
}

export async function getAdminPostStats() {
  const [total, published, draft, scheduled] = await Promise.all([
    db.post.count({ where: { deletedAt: null } }),
    db.post.count({ where: { deletedAt: null, status: "PUBLISHED" } }),
    db.post.count({ where: { deletedAt: null, status: "DRAFT" } }),
    db.post.count({ where: { deletedAt: null, status: "SCHEDULED" } }),
  ])
  return { total, published, draft, scheduled }
}

// ─── Tools ───────────────────────────────────────────────────────

export async function getAdminTools() {
  return db.tool.findMany({
    where:   { deletedAt: null },
    include: { category: true },
    orderBy: { name: "asc" },
  })
}

export async function getAdminToolStats() {
  const [total, published, usages] = await Promise.all([
    db.tool.count({ where: { deletedAt: null } }),
    db.tool.count({ where: { deletedAt: null, isPublished: true } }),
    db.toolUsage.count(),
  ])
  return { total, published, usages }
}

// ─── Categories ──────────────────────────────────────────────────

export async function getAdminCategories() {
  return db.category.findMany({ orderBy: { name: "asc" } })
}

// ─── Dashboard ───────────────────────────────────────────────────

export async function getDashboardStats() {
  const [posts, tools, users] = await Promise.all([
    getAdminPostStats(),
    getAdminToolStats(),
    db.user.count({ where: { deletedAt: null } }),
  ])
  return { posts, tools, users }
}

export async function getRecentPosts(limit = 5) {
  return db.post.findMany({
    where:   { deletedAt: null },
    include: { author: { select: { name: true } }, category: true },
    orderBy: { createdAt: "desc" },
    take:    limit,
  })
}

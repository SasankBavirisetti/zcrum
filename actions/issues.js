"use server";

import { db } from "@/prisma/db";
import { auth } from "@clerk/nextjs/server";

export async function getIssuesForSprint(sprintId) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const issues = await db.orm.public.Issue.where({ sprintId })
    .include("assignee")
    .include("reporter")
    .orderBy([
      (issue) => issue.status.asc(),
      (issue) => issue.order.asc(),
    ])
    .all();

  return issues;
}

export async function createIssue(projectId, data) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const user = await db.orm.public.User.where({ clerkUserId: userId }).first();

  const lastIssue = await db.orm.public.Issue.where({
    projectId,
    status: data.status,
  })
    .orderBy((issue) => issue.order.desc())
    .first();

  if (!user) {
    throw new Error("User not found");
  }

  const newOrder = lastIssue ? lastIssue.order + 1 : 0;

  const issue = await db.orm.public.Issue.create({
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    projectId,
    sprintId: data.sprintId,
    reporterId: user.id,
    assigneeId: data.assigneeId || null,
    order: newOrder,
  });

  return db.orm.public.Issue.where({ id: issue.id })
    .include("assignee")
    .include("reporter")
    .first();
}

export async function updateIssueOrder(updatedIssues) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // Start a transaction
  await db.transaction(async (tx) => {
    for (const issue of updatedIssues) {
      await tx.orm.public.Issue.where({ id: issue.id }).update({
        status: issue.status,
        order: issue.order,
      });
    }
  });

  return { success: true };
}

export async function deleteIssue(issueId) {
  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const user = await db.orm.public.User.where({ clerkUserId: userId }).first();

  if (!user) {
    throw new Error("User not found");
  }

  const issue = await db.orm.public.Issue.where({ id: issueId })
    .include("project")
    .first();

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (issue.project.organizationId !== orgId) {
    throw new Error("Unauthorized");
  }

  if (
    issue.reporterId !== user.id &&
    orgRole !== "org:admin"
  ) {
    throw new Error("You don't have permission to delete this issue");
  }

  await db.orm.public.Issue.where({ id: issueId }).delete();

  return { success: true };
}

export async function updateIssue(issueId, data) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  try {
    const issue = await db.orm.public.Issue.where({ id: issueId })
      .include("project")
      .first();

    if (!issue) {
      throw new Error("Issue not found");
    }

    if (issue.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    await db.orm.public.Issue.where({ id: issueId }).update({
      status: data.status,
      priority: data.priority,
    });

    return db.orm.public.Issue.where({ id: issueId })
      .include("assignee")
      .include("reporter")
      .first();
  } catch (error) {
    throw new Error("Error updating issue: " + error.message);
  }
}

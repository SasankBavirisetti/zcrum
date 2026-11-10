"use server";

import { db } from "@/prisma/db";
import { and, or } from "@prisma/orm-postgres/orm-client";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganization(slug) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.orm.public.User.where({ clerkUserId: userId }).first();

  if (!user) {
    throw new Error("User not found");
  }

  // Get the organization details
  const clerk = await clerkClient();
  const organization = await clerk.organizations.getOrganization({
    slug,
  });

  if (!organization) {
    return null;
  }

  // Check if user belongs to this organization
  const { data: membership } =
    await clerk.organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    });

  const userMembership = membership.find(
    (member) => member.publicUserData.userId === userId,
  );

  // If user is not a member, return null
  if (!userMembership) {
    return null;
  }

  return organization;
}

export async function getProjects(orgId) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.orm.public.User.where({ clerkUserId: userId }).first();

  if (!user) {
    throw new Error("User not found");
  }

  const projects = await db.orm.public.Project.where({
    organizationId: orgId,
  })
    .orderBy((project) => project.createdAt.desc())
    .all();

  return projects;
}

export async function getUserIssues(userId) {
  const { orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("No user id or organization id found");
  }

  const user = await db.orm.public.User.where({ clerkUserId: userId }).first();

  if (!user) {
    throw new Error("User not found");
  }

  const projects = await db.orm.public.Project.where({
    organizationId: orgId,
  })
    .select("id")
    .all();
  const projectIds = projects.map((project) => project.id);

  if (projectIds.length === 0) {
    return [];
  }

  const issues = await db.orm.public.Issue.where((issue) =>
    and(
      or(
        issue.assigneeId.eq(user.id),
        issue.reporterId.eq(user.id),
      ),
      issue.projectId.in(projectIds),
    ),
  )
    .include("assignee")
    .include("reporter")
    .orderBy((issue) => issue.updatedAt.desc())
    .all();

  return issues;
}

export async function getOrganizationUsers(orgId) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.orm.public.User.where({ clerkUserId: userId }).first();

  if (!user) {
    throw new Error("User not found");
  }

  const clerk = await clerkClient();
  const organizationMemberships =
    await clerk.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userIds = organizationMemberships.data.map(
    (membership) => membership.publicUserData.userId,
  );

  const users = await db.orm.public.User.where((user) =>
    user.clerkUserId.in(userIds),
  ).all();

  return users;
}

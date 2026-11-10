"use server";

import { db } from "@/prisma/db";
import { auth } from "@clerk/nextjs/server";

export async function createSprint(projectId, data) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const project = await db.orm.public.Project.where({ id: projectId }).first();

  if (!project || project.organizationId !== orgId) {
    throw new Error("Project not found");
  }

  const sprint = await db.orm.public.Sprint.create({
    name: data.name,
    startDate: data.startDate,
    endDate: data.endDate,
    status: "PLANNED",
    projectId,
  });

  return sprint;
}

export async function updateSprintStatus(sprintId, newStatus) {
  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  try {
    const sprint = await db.orm.public.Sprint.where({ id: sprintId })
      .include("project")
      .first();

    if (!sprint) {
      throw new Error("Sprint not found");
    }

    if (sprint.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    if (orgRole !== "org:admin") {
      throw new Error("Only Admin can make this change");
    }

    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);

    if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
      throw new Error("Cannot start sprint outside of its date range");
    }

    if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
      throw new Error("Can only complete an active sprint");
    }

    const updatedSprint = await db.orm.public.Sprint.where({
      id: sprintId,
    }).update({ status: newStatus });

    return { success: true, sprint: updatedSprint };
  } catch (error) {
    throw new Error(error.message);
  }
}

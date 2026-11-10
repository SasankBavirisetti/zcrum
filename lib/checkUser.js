import { db } from "../prisma/db";
import { currentUser } from "@clerk/nextjs/server";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const loggedInUser = await db.orm.public.User.where({
    clerkUserId: user.id,
  }).first();

  if (loggedInUser) {
    return loggedInUser;
  }

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("Cannot create a user without an email address");
  }

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return db.orm.public.User.create({
    clerkUserId: user.id,
    name,
    imageUrl: user.imageUrl,
    email,
  });
};

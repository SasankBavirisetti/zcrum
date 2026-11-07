import { db } from "../prisma/db";
import { currentUser } from "@clerk/nextjs/server";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

    
  try {
    // 1. Prisma 8 schema path structure: db.orm.public.User
    // 2. Filter pattern change: .where().first() replaces .findUnique()
    const loggedInUser = await db.orm.public.User.where({
      clerkUserId: user.id,
    }).first();

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    // 3. Prisma 8 creation pattern uses create() directly on the model route
    const newUser = await db.orm.public.User.create({
      clerkUserId: user.id,
      name,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress, // Ensure array index is kept if emailAddresses is a list
    });

    return newUser;
  } catch (error) {
    console.log("Prisma operation failed:", error);
  }
};

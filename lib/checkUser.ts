import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const checkUser = async () => {
  const user = await currentUser();

  //   console.log(user);

  // Check for current logged in clerk user
  if (!user) {
    return null;
  }

  // Check if the user is already in the database
  const dbUser = await db.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });

  // If user is in database, return user
  if (dbUser) {
    return dbUser;
  }

  // If not in database, create new user
  const newUser = await db.user.create({
    data: {
      clerkUserId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      imageUri: user.imageUrl,
    },
  });

  return newUser;
};

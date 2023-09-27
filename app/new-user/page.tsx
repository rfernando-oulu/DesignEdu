import { prisma } from "@/utils/db";
import { auth, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const createNewUser = async () => {
  const user = await currentUser();
  console.log(user);

  if (user !== null) {
    const match = await prisma.user.findUnique({
      where: {
        clerkId: user.id as string,
      },
    });

    if (!match) {
      await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
        },
      });
    }
  } else {
    // Handle the case where user is null, if needed
  }

  redirect("/week-01");
};

const NewUser = async () => {
  await createNewUser();
  return <div>Hi New User</div>;
};

export default NewUser;

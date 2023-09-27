import { Metadata } from "next";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/sidebar-nav";
import { UserButton, currentUser } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { prisma } from "@/utils/db";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Weekly Submission",
  description: "Creative Design Weekly Submissions",
};

const sidebarNavItems = [
  {
    title: "Week 01 (04 - 11 SEP '23)",
    href: "/week-01",
  },
  {
    title: "Week 02 (11 - 18 SEP '23)",
    href: "/week-02",
  },
  {
    title: "Week 03 (18 - 25 SEP '23)",
    href: "/week-03",
  },
  {
    title: "Week 04 (25 SEP - 02 OCT '23)",
    href: "/week-04",
  },
  
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const user = await currentUser();

  let userFullName = "User Name";

  if (user?.firstName != null && user?.lastName) {
    userFullName = user.firstName + " " + user.lastName;
  }

  const prismaUser = await prisma.user.findUnique({
    where: {
      clerkId: user?.id,
    },
  });

  console.log(prismaUser?.userType);
  // console.log(userFullName);

  return (
    <>
      {/* <div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div> */}
      <div className="space-y-6 p-10 pb-16">
        <div className="flex justify-between items-start space-x-6">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Creative Design</h2>
            <p className="text-muted-foreground">Update your course progress</p>
          </div>
          <div className="flex items-center border border-gray-400 p-4 rounded">
            <UserButton afterSignOutUrl="/"/>
            <div className="ml-2 text-white">{userFullName}</div>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          {prismaUser?.userType === "USER" ? (
            <div className="your-styles-for-user-type">
              <Card className="w-[350px]">
                <CardHeader>
                  <CardTitle>Select UserRole</CardTitle>
                  <CardDescription>
                  Please select your role before updating your progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="grid w-full items-center gap-4">
                      
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="framework">User Role</Label>
                        <Select>
                          <SelectTrigger id="framework">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="designer">Designer</SelectItem>
                            <SelectItem value="programmer">Programmer</SelectItem>
                            <SelectItem value="prototyper">Prototyper</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  
                  <Button>Submit</Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="flex-1 lg:max-w-2xl">{children}</div>
          )}

          <Toaster />
        </div>
      </div>
    </>
  );
}

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import UserMenu from "./user-menu";
import { checkUser } from "../lib/checkUser";
import UserLoading from "./user-loading";

export default async function Header() {
  await checkUser();
  return (
    <header className="container mx-auto">
      <nav className="py-6 px-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold">
            <Image
              src={"/logo2.png"}
              alt="Zscrum Logo"
              width={200}
              height={56}
              className="h-10 w-auto object-contain"
            />
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/project/create">
            <Button variant="destructive" className="flex items-center gap-2">
              <PenBox size={18} />
              <span className="hidden md:inline">Create Project</span>
            </Button>
          </Link>

          <Suspense>
            <Show when="signed-out">
              <SignInButton mode="modal" forceRedirectUrl="/onboarding">
                <Button variant="outline">Sign In</Button>
              </SignInButton>
              {/* <SignUpButton mode="modal">
                <button className="bg-purple-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton> */}
            </Show>
            <Show when="signed-in">
              <UserMenu/>
            </Show>
          </Suspense>
        </div>
      </nav>
      <UserLoading />
    </header>
  );
}

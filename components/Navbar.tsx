"use client";

import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Menu } from "lucide-react";
import Image from "next/image";
import LogoSrc from "@/public/logo.svg";
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const handleSignIn = async () => {
    await signIn("google");
  };
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    // Desktop navigation
    <>
      <div className="hidden sm:flex">
        <NavigationMenu className="h-16 mx-16 bg-orange">
          <div className="font-bold text-2xl mr-6">
            <Link href="/">
              <Image src={LogoSrc} alt="BEAST Logo" width={90} />
            </Link>
          </div>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/guides" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Guides
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/track" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Track Workout
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/leaderboard" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Leaderboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/profile" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Profile
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {session ? (
              <NavigationMenuItem>
                <button onClick={handleSignOut}>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Logout
                  </NavigationMenuLink>
                </button>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <button onClick={handleSignIn}>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Login
                  </NavigationMenuLink>
                </button>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {/* Mobile navigation */}
      <div className="flex sm:hidden">
        <Sheet>
          <SheetTrigger className="mt-8 ml-10">
            <Menu />
          </SheetTrigger>
          <SheetContent side="top">
            <SheetHeader className="text-left">
              <SheetTitle className="mb-2 text-2xl">Menu</SheetTitle>
              <SheetDescription className="flex-col flex text-lg font-semibold gap-4 text-black underline underline-offset-4">
                <SheetClose>
                  <Link href="/profile">Guides</Link>
                </SheetClose>
                <Link href="/profile">Track Workout</Link>
                <Link href="/profile">Leaderboard</Link>
                <Link href="/profile">Profile</Link>
                {session ? (
                  <Link href="/profile">Logout</Link>
                ) : (
                  <Link href="/profile">Login</Link>
                )}
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
export default Navbar;

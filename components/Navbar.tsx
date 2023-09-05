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

import { LogOut, Menu } from "lucide-react";
import Image from "next/image";
import LogoSrc from "@/public/logo.svg";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const pathname = usePathname();

  const handleSignIn = async () => {
    setLoggingIn(true);
    await signIn("google");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
                <button
                  onClick={handleSignIn}
                  disabled={loggingIn}
                  className={`${loggingIn && "text-gray-600"}`}>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {loggingIn ? "Logging In..." : "Login"}
                  </NavigationMenuLink>
                </button>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {/* Mobile navigation */}
      <div className="flex sm:hidden">
        <Sheet open={open}>
          <SheetTrigger onClick={() => setOpen(true)} className="mt-8 ml-10">
            <Menu />
          </SheetTrigger>
          <SheetContent side="top" onInteractOutside={() => setOpen(false)}>
            <SheetHeader className="text-left">
              <X
                className={`absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  open ? "data-open:bg-secondary" : ""
                }`}
                onClick={() => setOpen(false)}
              />
              <SheetTitle className="mb-2 text-2xl">Menu</SheetTitle>
              <SheetDescription className="flex-col flex text-lg font-semibold gap-4 text-black underline underline-offset-4">
                <Link href="/guides">Guides</Link>
                <Link href="/track">Track Workout</Link>
                <Link href="/leaderboard">Leaderboard</Link>
                <Link href="/profile">Profile</Link>
                {session ? (
                  <h1 onClick={handleSignOut}>Logout</h1>
                ) : (
                  <h1 onClick={handleSignIn}>Login</h1>
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

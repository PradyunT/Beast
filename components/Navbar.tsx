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
    <NavigationMenu className="h-16 mx-16">
      <div className="font-bold text-2xl mr-8">
        <Link href="/">
          <h2>BEAST</h2>
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
        {session ? (
          <>
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
            <NavigationMenuItem>
              <button onClick={handleSignOut}>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Logout
                </NavigationMenuLink>
              </button>
            </NavigationMenuItem>
          </>
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
  );
};
export default Navbar;

"use client";

// import { LinkIcon } from "lucide-react";
// import Link from "next/link";
import { Button } from "@/components/ui/button";
import invertedLogoSrc from "@/public/logoInverted.svg";
// import heroVideoSrc from "@/public/videos/heroVideo.mp4";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <main className="text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-[100%] h-[100%] object-cover brightness-50 -z-10">
        <source src="/videos/heroVideo.mp4" />
      </video>
      <div className="flex flex-col text-left justify-start">
        <div className={`${montserrat.className}`}>
          {" "}
          <h1 className={`text-5xl font-semibold mb-4 sm:text-8xl`}>
            welcome to{" "}
          </h1>
          <Image
            src={invertedLogoSrc}
            alt="Inverted Logo"
            className="w-[20rem] h-auto mb-4 sm:w-[25rem]"
          />
          <h1 className="text-3xl font-semibold mb-16">
            physical fitness. <br />
            elevated.
          </h1>
        </div>
        <Button
          className={`bg-white text-xl font-semibold rounded-none text-black w-36 h-12 hover:bg-gray-300 ${
            session && "w-40"
          }`}
          onClick={
            session ? () => router.push("/profile") : () => signIn("google")
          }>
          {session ? "go to profile." : "join now."}
        </Button>
      </div>
      {/* <div>
        <h1 className="heading">Welcome to BEAST</h1>
        <h2 className="text-xl font-semibold mt-2">
          TAMS&apos; gym and physical fitness club
        </h2>
        <h2 className="text-xl font-semibold mt-1">
          This website has all of our resources to help you reach your fitness
          goals.
        </h2>
        <p className="mt-4">
          Create your{" "}
          <Link className="header-link font-semibold underline" href="/profile">
            profile
          </Link>
          , set your{" "}
          <Link className="header-link font-semibold underline" href="/profile">
            goals
          </Link>
          , read{" "}
          <Link className="header-link font-semibold underline" href="/guides">
            guides
          </Link>{" "}
          selected for you, start{" "}
          <Link className="header-link font-semibold underline" href="/profile">
            tracking
          </Link>{" "}
          your workouts, and stay accountable with the{" "}
          <Link className="header-link font-semibold underline" href="/profile">
            leaderboard
          </Link>{" "}
          all in one place.
        </p>
      </div> 
      <div className="mt-12">
        <Link
          className="header-link text-2xl font-semibold"
          href="https://docs.google.com/forms/d/e/1FAIpQLSc2LNXckJcRDnA9juvwrtAQU6FrPEQEsvPFPA_D34uTcYtrJA/viewform?usp=sf_link">
          Signup to be a trainer <LinkIcon className="inline" />
        </Link>
      </div>
      */}
    </main>
  );
}

import { LinkIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="">
      <div>
        <h1 className="heading">Welcome to BEAST</h1>
        <h2 className="text-xl font-semibold text-gray-700 mt-2">
          TAMS&apos; gym and physical fitness club
        </h2>
        <h2 className="text-xl font-semibold text-gray-700 mt-1">
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
    </main>
  );
}

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

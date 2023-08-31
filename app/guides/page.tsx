import { LinkIcon } from "lucide-react";
import Link from "next/link";

const guides = () => {
  return (
    <div>
      <h1 className="heading">Guides</h1>
      <div className="mt-4">
        <Link
          className="header-link text-2xl font-semibold mt-1 block"
          href="/guides/start-exercising">
          How to Get Started at the Gym <LinkIcon className="inline" />
        </Link>
        <Link
          className="header-link text-2xl font-semibold mt-1 block"
          href="/">
          How to start Bulking <LinkIcon className="inline" />
        </Link>
        <Link
          className="header-link text-2xl font-semibold mt-1 block"
          href="/">
          How to start Cutting <LinkIcon className="inline" />
        </Link>
      </div>
    </div>
  );
};
export default guides;

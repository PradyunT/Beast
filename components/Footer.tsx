import { FacebookIcon } from "lucide-react";

const Footer = () => {
  return (
    <section id="footer">
      <div className="w-full h-24 mt-8 bg-white flex flex-col justify-center items-center font-semibold text-center">
        <h1>Built by Pradyun Tandra 💪</h1>
        <div className="flex flex-row mt-2">
          <h1>Beta</h1>
          <a
            href="mailto:pradyun.tandra@gmail.com"
            className="link font-bold mx-2">
            Send feedback
          </a>
          <FacebookIcon
            className="link cursor-pointer"
            href="https://www.facebook.com/groups/tamsbeast"
          />
        </div>
      </div>
    </section>
  );
};
export default Footer;

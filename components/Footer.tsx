const Footer = () => {
  return (
    <section id="footer">
      <div className="w-full h-24 mt-8 bg-white flex justify-center items-center font-semibold">
        <div className="text-center">
          <h1>Built by Pradyun Tandra 💪</h1>
          <h1>
            Beta version{" "}
            <a
              href="mailto:pradyun.tandra@gmail.com"
              className="text-gray-700 link font-bold">
              Send feedback
            </a>
          </h1>
        </div>
      </div>
    </section>
  );
};
export default Footer;

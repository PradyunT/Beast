import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div>
      <h1 className="heading">
        Loading
        <Loader2 width={50} height={50} className="spinner inline ml-2" />
      </h1>
    </div>
  );
};
export default Loader;

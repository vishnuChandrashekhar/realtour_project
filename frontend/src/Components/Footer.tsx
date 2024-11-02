import React from "react";
import { FaGithub } from "react-icons/fa";
import { FaRegCopyright } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <div className="w-full bg-slate-700 p-4 flex gap-2 items-center justify-center">
      <FaRegCopyright className="text-white h-3" />
      <p className="text-white">All rights reserved - </p>
      <FaGithub className="text-white" />
      <Link
        to={`https://github.com/vishnuChandrashekhar`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-300 font-semibold">
        vishnu_chandrashekhar
      </Link>
    </div>
  );
};

export default Footer;

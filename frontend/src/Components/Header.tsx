import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { UserState } from "../Redux/user/userSlice";

const Header: React.FC = () => {
  const { currentUser } = useSelector(
    (state: RootState) => state.user
  ) as UserState;
  const naviagte = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    naviagte(`/search?${searchQuery}`);
  };

  // Setting the ur search value same as the search bar value
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromURl = urlParams.get("searchTerm");
    if (searchTermFromURl) {
      setSearchTerm(searchTermFromURl || "");
    }
  }, [window.location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to={"/"}>
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Realtour</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-1.5 rounded-lg flex items-center justify-between">
          <input
            type="text"
            placeholder="Search....."
            className="bg-transparent p-0.5 focus:outline-none w-24 sm:w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button>
            <FaSearch className="text-slate-700 cursor-pointer" />
          </button>
        </form>
        <ul className="flex gap-4 cursor-pointer">
          <Link to={"/"}>
            <li className="hidden sm:inline text-slate-700 hover:underline font-semibold active:font-bold">
              Home
            </li>
          </Link>
          <Link to={"/about"}>
            <li className="hidden sm:inline text-slate-700 hover:underline font-semibold">
              About
            </li>
          </Link>
          <Link to={currentUser && currentUser.avatar ? "/profile" : "/signin"}>
            {currentUser && currentUser.avatar ? (
              <img
                className="rounded-full h-7 w-7 object-cover border"
                src={currentUser.avatar}
                alt="profile-pic"
              />
            ) : (
              <li className="text-slate-700 hover:underline font-semibold">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;

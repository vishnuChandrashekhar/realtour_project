import React from "react";
import { Link } from "react-router-dom";

const About: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col gap-4 justify-center">
        <h1 className="text-3xl font-semibold text-center text-slate-700 ">
          About <span className="text-slate-500">Realtour Estate</span>
        </h1>
        <p className="text-lg text-slate-700">
          Welcome to RealTour Estate, your go-to platform for finding, listing,
          and securing real estate deals with ease and confidence. Our mission
          is to simplify the property market, empowering both property owners
          and seekers to connect effortlessly
        </p>
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-xl text-slate-700">What We Do</h2>
          <p className="text-lg text-slate-700">
            RealTour Estate provides a straightforward way for property owners
            and landlords to list their homes, apartments, and commercial spaces
            online, and it gives home seekers a comprehensive search experience.
            With just a few clicks, anyone can sign up, create a listing, and
            share it with a wide audience. We showcase a diverse range of
            properties, from cozy apartments to luxury villas, in neighborhoods
            across the country.
          </p>
          <h2 className="font-semibold text-xl text-slate-700">
            For Property Owners
          </h2>
          <p className="text-lg text-slate-700">
            Whether you're a landlord, real estate agent, or a homeowner looking
            to rent or sell, RealTour Estate makes the process seamless. Simply
            create an account, set up your listing with photos and descriptions,
            and publish it to reach interested buyers or renters. Our
            user-friendly interface ensures that setting up a listing is quick
            and hassle-free, so you can focus on finding the right tenant or
            buyer.
          </p>
          <h2 className="font-semibold text-xl text-slate-700">
            For Property Seekers
          </h2>
          <p className="text-lg text-slate-700">
            Finding your next home or investment property has never been easier.
            RealTour Estate allows you to search by location, price, type, and
            amenities to discover properties that meet your needs. When you find
            the perfect match, you can directly contact the landlord or property
            owner through our secure platform, keeping communication clear and
            convenient.
          </p>
          <h2 className="font-semibold text-xl text-slate-700">
            Our Commitment
          </h2>
          <p className="text-lg text-slate-700">
            We are committed to providing a safe, transparent, and user-friendly
            experience for everyone involved. With verified listings, helpful
            resources, and responsive support, RealTour Estate is designed to
            make your real estate journey smooth, efficient, and rewarding.
          </p>
        </div>
      </div>
      <div className="w-full my-3 py-2 flex flex-col items-center">
        <Link to={"/search"}>
          <button className="bg-slate-700 text-white text-xl w-[220px] h-full p-3 hover:opacity-90">
            Explore
          </button>
        </Link>
      </div>
    </div>
  );
};

export default About;

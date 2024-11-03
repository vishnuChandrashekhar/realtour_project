import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ListingType } from "../Types/typesForDevlopment";
import { SwiperSlide, Swiper } from "swiper/react";

import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import ListingCard from "../Components/ListingCard";

const Home: React.FC = () => {
  const [offerListings, setOfferListings] = useState<ListingType[]>([]);
  const [saleListing, setSaleListings] = useState<ListingType[]>([]);
  const [rentListings, setRentListings] = useState<ListingType[]>([]);

  console.log(offerListings);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=3`);
        const data: ListingType[] = await res.json();
        setOfferListings(data);
        fetchRentListing();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListing = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=3`);
        const data: ListingType[] = await res.json();
        setRentListings(data);
        fetchSaleListing();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListing = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=3`);
        const data: ListingType[] = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListing();
  }, []);
  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find Your <span className="text-slate-500">Dream Home</span>
          <br /> with RealTour Estate
        </h1>
        <p className="text-gray-600 sm:text-sm text-xs">
          Discover the perfect place to call home with RealTour Estate, your
          trusted platform for buying, selling, and exploring properties.
          Whether you're looking for a modern city apartment, a family-friendly
          home in the suburbs, or a luxury villa by the sea, we bring you a
          curated collection of properties to fit every lifestyle and budget.
          With expert guidance, detailed listings, and personalized
          recommendations, we make it easy to turn your real estate goals into
          reality. Start your journey with RealTour Estate and experience
          property searching redefined.
        </p>
        <Link
          to={`/search`}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline">
          Find your perfect space today!
        </Link>
      </div>
      {/* Swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageURLs}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
                key={listing._id as React.Key}></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Listing results */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-2">
              <h2 className="text-slate-600 text-2xl sm:text-4xl font-semibold ">
                Recent Offer
              </h2>
              <Link
                to={`/search?offer=true`}
                className="text-blue-600 font-semibold text-sm hover:underline">
                Show more...
              </Link>
            </div>
            <div className="flex gap-5 flex-wrap justify-between">
              {offerListings.map((listing) => (
                <ListingCard key={listing._id as React.Key} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-2">
              <h2 className="text-slate-600 text-2xl sm:text-4xl font-semibold ">
                Recent places for rent
              </h2>
              <Link
                to={`/search?type=rent`}
                className="text-blue-600 font-semibold text-sm hover:underline">
                Show more...
              </Link>
            </div>
            <div className="flex gap-5 flex-wrap justify-between">
              {rentListings.map((listing) => (
                <ListingCard key={listing._id as React.Key} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {saleListing && saleListing.length > 0 && (
          <div className="">
            <div className="my-2">
              <h2 className="text-slate-600 text-2xl sm:text-4xl font-semibold ">
                Recent places for sale
              </h2>
              <Link
                to={`/search?type=sale`}
                className="text-blue-600 font-semibold text-sm hover:underline">
                Show more...
              </Link>
            </div>
            <div className="flex gap-5 flex-wrap justify-between">
              {saleListing.map((listing) => (
                <ListingCard key={listing._id as React.Key} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

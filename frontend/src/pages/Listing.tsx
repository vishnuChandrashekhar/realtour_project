import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ListingType } from "../Types/typesForDevlopment";
import { ErrorObject } from "../Types/typesForDevlopment";
// For Slider
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { FaBed, FaLocationDot } from "react-icons/fa6";
import { FaBath, FaChair, FaParking, FaShareAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import Contact from "../Components/Contact";
import { toast } from "react-toastify";
import { UserState } from "../Redux/user/userSlice";
const Listing: React.FC = () => {
  //Slider initialization
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState<ListingType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | boolean>(false);
  const [contact, setContact] = useState<boolean>(false);

  const params = useParams();
  const { currentUser } = useSelector(
    (state: RootState) => state.user
  ) as UserState;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/listing/getListingById/${
            params.listingId
          }`,
          {
            method: "GET",
          }
        );
        const data: ListingType | ErrorObject = await res.json();

        if ("success" in data && data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }

        setListing(data as ListingType);
        setLoading(false);
        setError(false);
      } catch (error: any) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  const handleShareListing = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied", {
        position: "bottom-left",
        autoClose: 2000,
        closeOnClick: true,
        draggable: true,
        hideProgressBar: true,
        theme: "light",
      });
      console.log(toast.success);
    } catch (error) {
      toast.error("Failed to copy link", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading....</p>}
      {error && (
        <p className="text-center my-7 text-2xl text-red-700">{error}</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageURLs.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      <div className="p-3 max-w-6xl mx-auto">
        {listing && (
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-slate-700 my-4">
              {listing.title}-{" "}
              <span className="text-3xl font-bold">
                {listing.offer
                  ? listing.discountedPrice.toLocaleString("en-US")
                  : listing.regularPrice.toLocaleString("en-US")}
                ₹
              </span>
              {listing.type === "rent" && <span> /month</span>}
            </h1>
            <div className="flex items-center gap-3">
              <FaLocationDot className="text-green-800 my-2 text-lg" />
              <p className="text-lg text-slate-700">{listing.address}</p>
            </div>
            <div className="flex flex-nowrap items-center gap-4">
              <p className="w-full max-w-[220px] bg-red-900 text-white p-2 text-center rounded-lg my-1">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="w-full max-w-[220px] bg-green-800 text-white p-2 text-center rounded-lg my-1">
                  ₹{+listing.regularPrice - +listing.discountedPrice}{" "}
                  <span> - Discount</span>
                </p>
              )}
            </div>
            <div>
              <p className="text-slate-700 text-lg">
                <span className="text-xl font-semibold">Discription - </span>
                {listing.description}
              </p>
              <ul className="my-2 flex items-center gap-4 sm:gap-6 text-green-900 font-semibold text-m flex-wrap">
                <li className="flex items-center gap-2 whitespace-nowrap ">
                  <FaBed className="text-lg" />
                  {listing.bedrooms > 1
                    ? `${listing.bedrooms} beds`
                    : `${listing.bedrooms} bed`}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap ">
                  <FaBath className="text-lg" />
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} baths`
                    : `${listing.bathrooms} bath`}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap ">
                  <FaParking className="text-lg" />
                  {listing.parking ? "Parking Available" : "No Parking"}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap ">
                  <FaChair className="text-lg" />
                  {listing.furnished ? "Furnished" : "Not Furnished"}
                </li>
              </ul>
            </div>
            <button
              onClick={handleShareListing}
              className=" flex items-center justify-center gap-2 bg-blue-600 max-w-[220px] text-white p-3 rounded-lg mt-4 hover:opacity-95">
              {" "}
              <FaShareAlt />
              Share Listing
            </button>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3">
                Contact Landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        )}
      </div>
    </main>
  );
};

export default Listing;

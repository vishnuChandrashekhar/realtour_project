import React from "react";
import { ListingType } from "../Types/typesForDevlopment";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

interface ListingCardProps {
  listing: Partial<ListingType>;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  return (
    <div className="bg-slate-100 shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageURLs?.[0] ||
            `https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`
          }
          alt="listing_image"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-1000"
        />
        <div className="p-3 flex flex-col gap-3 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.title}
          </p>
          <div className="flex items-center gap-2">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="truncate text-sm text-gray-600">{listing.address}</p>
          </div>
          <p className="line-clamp-2 text-sm text-gray-600">
            {listing.description}
          </p>
          <p className="text-xl font-semibold mt-2 text-slate-500 ">
            {listing.offer
              ? listing.discountedPrice?.toLocaleString("en-US")
              : listing.regularPrice?.toLocaleString("en-US")}
            ₹ {listing.type === "rent" ? `/Month` : ` - For Sale`}
          </p>
          <div className="flex gap-4 items-center">
            <p className="font-semibold text-slate-600 text-sm">
              {listing.bedrooms !== undefined
                ? listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `
                : "N/A"}
            </p>
            <p>|</p>
            <p className="font-semibold text-slate-600 text-sm">
              {listing.bathrooms !== undefined
                ? listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `
                : "N/A"}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;

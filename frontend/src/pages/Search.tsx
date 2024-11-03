import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListingType } from "../Types/typesForDevlopment";
import ListingCard from "../Components/ListingCard";

const Search: React.FC = () => {
  interface sidebarData {
    searchTerm: string;
    type: string;
    parking: boolean | string;
    furnished: boolean | string;
    offer: boolean | string;
    sort: string;
    order: string;
  }

  const naviagate = useNavigate();

  const [sidebarData, setSidebarData] = useState<sidebarData>({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [listings, setListings] = useState<Partial<ListingType>[]>([]);
  const [showMoreButton, setShowMoreButton] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const updatedData = {
      searchTerm: urlParams.get("searchTerm") || "",
      type: urlParams.get("type") || "all",
      parking: urlParams.get("parking") === "true" ? true : "",
      furnished: urlParams.get("furnished") === "true" ? true : "",
      offer: urlParams.get("offer") === "true" ? true : "",
      sort: urlParams.get("sort") || "createdAt",
      order: urlParams.get("order") || "desc",
    };

    setSidebarData(updatedData);

    const fetchData = async () => {
      setLoading(true);
      setShowMoreButton(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/listing/get?${searchQuery}`,
        {
          method: "GET",
        }
      );
      const data: ListingType[] = await res.json();

      if (data.length > 8) {
        setShowMoreButton(true);
      } else {
        setShowMoreButton(false);
      }

      setListings(data);
      setLoading(false);
    };

    fetchData();
  }, [location.search]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value, checked } = e.target as HTMLInputElement;

    const booleanFields = ["parking", "furnished", "offer"];

    if (id === "all" || id === "rent" || id === "sale") {
      setSidebarData({ ...sidebarData, type: id });
    }

    if (id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: value });
    }

    if (booleanFields.includes(id) && e.target instanceof HTMLInputElement) {
      setSidebarData({ ...sidebarData, [id]: checked });
    }

    if (id === "sort_order") {
      const sort = value.split("_")[0] || "createdAt";
      const order = value.split("_")[1] || "desc";

      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", String(sidebarData.parking));
    urlParams.set("offer", String(sidebarData.offer));
    urlParams.set("furnished", String(sidebarData.furnished));
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);

    const searchQuery = urlParams.toString();
    naviagate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings: number = listings.length;
    const startIndex: string = numberOfListings.toString();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    // fetch data
    const res: Response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/listing/get?${searchQuery}`,
      {
        method: "GET",
      }
    );
    const data: ListingType[] = await res.json();

    if (data.length < 9) {
      setShowMoreButton(false);
    }
    // Keep the previous listing data same , and add the new data to the same array
    setListings([...listings, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="all"
                className="h-5 w-5"
                onChange={handleChange}
                checked={sidebarData.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="rent"
                className="h-5 w-5"
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="sale"
                className="h-5 w-5"
                onChange={handleChange}
                checked={sidebarData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="offer"
                className="h-5 w-5"
                onChange={handleChange}
                checked={sidebarData.offer === true}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Aminities:</label>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="parking"
                className="h-5 w-5"
                onChange={handleChange}
                checked={sidebarData.parking === true}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="furnished"
                className="h-5 w-5"
                onChange={handleChange}
                checked={sidebarData.furnished === true}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-semibold">Sort:</label>
            <select
              name="sort"
              id="sort_order"
              className="border rounded-lg p-3"
              onChange={handleChange}
              defaultValue={"createdAt_desc"}>
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b-2 p-3 text-slate-700 mt-5">
          Listing Results:{" "}
        </h1>
        <div className="p-4 flex flex-wrap gap-6">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading.....
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingCard key={listing._id as React.Key} listing={listing} />
            ))}
          {showMoreButton && (
            <button
              onClick={onShowMoreClick}
              className="text-green-600 hover:underline-offset-1 p-4 text-center w-full">
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;

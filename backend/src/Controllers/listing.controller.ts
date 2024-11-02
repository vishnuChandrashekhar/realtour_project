import { Response, Request, NextFunction } from "express";
import { throwError } from "../utils/error.handler";
import mongoose from "mongoose";
import Listing from "../Models/listing.model";

export const createListing = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const listng = await Listing.create(req.body);
    res.status(201).json(listng);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(throwError(404, "Listing not found"));
  }
  if (req.user?.id !== listing.userRef) {
    return next(throwError(401, "You can only delete your own listing"));
  }

  try {
    const deletedListing = await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Listing deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const listingId = new mongoose.Types.ObjectId(req.params.id);

  // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //   return next(throwError(400, "Inavlid Listing Id"));
  // }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    return next(throwError(404, "Listing not found"));
  }
  if (req.user?.id !== listing.userRef) {
    return next(throwError(401, `you can only update your own listing`));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = new mongoose.Types.ObjectId(req.params.id);

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(throwError(404, `Listing not found`));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 9;
    const startIndex = parseInt(req.query.startIndex as string) || 0;

    // Query building
    let query: any = {};

    const searchTerm = req.query.searchTerm || "";

    if (searchTerm) {
      query.title = { $regex: searchTerm, $options: "i" };
    }

    const offer = req.query.offer;
    // if (offer === "true") {
    //   query.offer = true;
    // } else if (offer === "false") {
    //   query.offer = false;
    // }

    offer === "true"
      ? (query.offer = true)
      : offer === "false"
      ? (query.offer = false)
      : null;

    const furnished = req.query.furnished;
    // if (furnished === "true") {
    //   query.furnished = true;
    // } else if (furnished === "false") {
    //   query.furnished = false;
    // }

    furnished && furnished === "true"
      ? (query.furnished = true)
      : furnished === "false"
      ? (query.furnished = false)
      : null;

    const parking = req.query.parking;
    // if (parking === "true") {
    //   query.parking = true;
    // } else if (parking === "false") {
    //   query.parking = false;
    // }

    parking && parking === "true"
      ? (query.parking = true)
      : parking === "false"
      ? (query.parking = false)
      : null;

    const type = req.query.type;
    if (type && type !== "all") {
      query.type = type;
    } else if (type === "all") {
      query.type = { $in: ["sale", "rent"] };
    }

    // type && type !== "all" ? query.type = type : type === "all" ? query.type = { $in: ["sale", "rent"]} : null

    const sort = (req.query.sort as string) || "createdAt";
    // const sortField = typeof sortParam === "string" ? sortParam : "createdAt";
    const orderParam = req.query.order;
    const order = orderParam === "desc" ? -1 : 1;

    const listings = await Listing.find(query)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

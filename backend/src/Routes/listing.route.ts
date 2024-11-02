import express from "express";

import { verifyToken } from "../utils/verifyUser";
import {
  createListing,
  deleteListing,
  getListing,
  getListingById,
  updateUserListing,
} from "../Controllers/listing.controller";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateUserListing);
router.get("/getListingById/:id", getListingById);
router.get(`/get`, getListing);

export default router;

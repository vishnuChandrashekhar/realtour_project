import express from "express";
import {
  deleteUser,
  getUser,
  getUserListing,
  updateUserInfo,
} from "../Controllers/user.controller";
import { verifyToken } from "../utils/verifyUser";

const router = express.Router();

router.post("/update/:id", verifyToken, updateUserInfo);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListing);
router.get("/:id", verifyToken, getUser);
export default router;

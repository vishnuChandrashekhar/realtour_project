import express from "express";
import {
  googleAuth,
  signin,
  signout,
  signup,
} from "../Controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleAuth);
router.get("/signout", signout);

export default router;

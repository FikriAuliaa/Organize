import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getMyRegistrations,
  applyForOrganizer,
  getAllOrganizers,
  getOrganizerProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, getUserProfile);
router.get("/myregistrations", protect, getMyRegistrations);
router.put("/apply-organizer", protect, applyForOrganizer);
router.get("/organizers", getAllOrganizers);
router.get("/organizers/:id", getOrganizerProfile);
router.put("/profile", protect, updateUserProfile);

export default router;

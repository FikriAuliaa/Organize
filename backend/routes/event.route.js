import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  registerForEvent,
  updateEvent,
  deleteEvent,
  getMyCreatedEvents,
  getEventRegistrations,
  createRepaymentToken,
} from "../controllers/event.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").get(getAllEvents).post(protect, createEvent);
router.get("/myevents", protect, getMyCreatedEvents);

router
  .route("/:id")
  .get(getEventById)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

router.route("/:id/register").post(protect, registerForEvent);
router.route("/:id/registrations").get(protect, getEventRegistrations);
router.route("/registrations/:id/repay").post(protect, createRepaymentToken);

export default router;

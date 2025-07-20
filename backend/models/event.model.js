import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    price: { type: Number, default: 0 },
    quota: { type: Number, required: true },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      default: "https://via.placeholder.com/400x250.png?text=EventKita",
    },
    customFormFields: [
      {
        label: { type: String, required: true },
        fieldType: {
          type: String,
          enum: ["text", "email", "number"],
          default: "text",
        },
        isRequired: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;

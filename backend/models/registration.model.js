import mongoose from "mongoose";

const registrationSchema = mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    uniqueTicketCode: {
      type: String,
      required: true,
      unique: true,
    },
    customAnswers: [
      {
        fieldLabel: String,
        answer: String,
      },
    ],
    // Tambahan field untuk tracking pembayaran
    paymentOrderId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk mencegah duplikasi registrasi per event per user
registrationSchema.index({ event: 1, participant: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);
export default Registration;

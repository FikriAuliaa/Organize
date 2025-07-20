import Event from "../models/event.model.js";
import Registration from "../models/registration.model.js";
import midtransclient from "midtrans-client";
import mongoose from "mongoose";

export const createEvent = async (req, res) => {
  const { title, description, date, price, quota, customFormFields, imageUrl } =
    req.body;
  try {
    const event = new Event({
      title,
      description,
      date,
      price,
      quota,
      organizer: req.user._id,
      imageUrl,
      customFormFields: customFormFields || [],
    });
    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const pageSize = 10; // Menetapkan 10 acara per halaman
    const page = Number(req.query.pageNumber) || 1; // Mengambil nomor halaman dari query URL, default ke halaman 1

    // Logika filter Anda (tidak berubah)
    const filter = {};
    if (req.query.keyword) {
      filter.$or = [
        { title: { $regex: req.query.keyword, $options: "i" } },
        { description: { $regex: req.query.keyword, $options: "i" } },
      ];
    }
    if (req.query.price) {
      if (req.query.price === "gratis") {
        filter.price = 0;
      } else if (req.query.price === "berbayar") {
        filter.price = { $gt: 0 };
      }
    }
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) {
        filter.date.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        let endDate = new Date(req.query.endDate);
        endDate.setDate(endDate.getDate() + 1);
        filter.date.$lte = endDate;
      }
    }

    // --- LOGIKA PAGINATION DIMULAI DI SINI ---

    // 1. Hitung total dokumen yang cocok dengan filter
    const count = await Event.countDocuments(filter);

    // 2. Ambil data hanya untuk halaman yang diminta
    const events = await Event.find(filter)
      .sort({ date: 1 })
      .limit(pageSize) // Batasi hasil sebanyak pageSize
      .skip(pageSize * (page - 1)); // Lewati dokumen dari halaman sebelumnya

    // 3. Kirim kembali data acara beserta informasi halaman
    res.status(200).json({ events, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "name"
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
export const registerForEvent = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const { _id: participantId } = req.user;
    const { customAnswers } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Acara tidak ditemukan" });
    }

    const alreadyRegistered = await Registration.findOne({
      event: eventId,
      participant: participantId,
    });
    if (alreadyRegistered) {
      return res
        .status(400)
        .json({ message: "Anda sudah terdaftar di acara ini" });
    }

    if (event.price === 0) {
      const registration = await Registration.create({
        event: eventId,
        participant: participantId,
        status: "paid",
        uniqueTicketCode: `TKT-${eventId.slice(-5)}-${Date.now()}`,
        customAnswers: customAnswers || [],
      });
      return res
        .status(201)
        .json({ message: "Pendaftaran berhasil!", registration });
    }

    // --- Alur Aman untuk Acara Berbayar ---
    const tempOrderId = new mongoose.Types.ObjectId();

    const snap = new midtransclient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    // --- PERBAIKAN UTAMA DI SINI ---
    const parameter = {
      transaction_details: {
        order_id: tempOrderId.toString(),
        gross_amount: event.price,
      },
      customer_details: {
        first_name: req.user.name,
        email: req.user.email,
      },
      // Tambahkan custom fields agar webhook bisa mengidentifikasi pendaftaran
      custom_field1: eventId,
      custom_field2: participantId,
      custom_field3: JSON.stringify(customAnswers || []),
    };
    // ------------------------------------

    const paymentToken = await snap.createTransactionToken(parameter);

    const registration = await Registration.create({
      _id: tempOrderId,
      event: eventId,
      participant: participantId,
      status: "pending",
      uniqueTicketCode: `TKT-${eventId.slice(-5)}-${Date.now()}`,
      customAnswers: customAnswers || [],
      paymentOrderId: tempOrderId.toString(),
    });

    res.status(201).json({
      message: "Registrasi dibuat, silakan lanjutkan pembayaran.",
      registration,
      paymentToken,
    });
  } catch (error) {
    console.error("REGISTRATION/PAYMENT ERROR:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  const { title, description, date, price, quota } = req.body;
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Acara tidak ditemukan" });
    }
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User tidak berwenang" });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.price = price !== undefined ? price : event.price;
    event.quota = quota !== undefined ? quota : event.quota;
    // Note: imageUrl and customFormFields update logic can be added here as well

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Acara tidak ditemukan" });
    }
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User tidak berwenang" });
    }
    await event.deleteOne();
    res.json({ message: "Acara berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getMyCreatedEvents = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "User tidak ditemukan atau tidak berwenang" });
    }
    const events = await Event.find({ organizer: req.user._id }).sort({
      date: -1,
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Acara tidak ditemukan" });
    }
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User tidak berwenang" });
    }
    const registrations = await Registration.find({
      event: req.params.id,
    }).populate("participant", "name email");
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const createRepaymentToken = async (req, res) => {
  try {
    const { id: registrationId } = req.params;
    const registration = await Registration.findById(registrationId).populate(
      "event"
    );

    if (!registration) {
      return res.status(404).json({ message: "Pendaftaran tidak ditemukan" });
    }

    // Pastikan pengguna yang meminta adalah pemilik pendaftaran
    if (registration.participant.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Tidak berwenang" });
    }

    const snap = new midtransclient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    const parameter = {
      transaction_details: {
        order_id: registration._id.toString(),
        gross_amount: registration.event.price,
      },
      customer_details: {
        first_name: req.user.name,
        email: req.user.email,
      },
    };

    const paymentToken = await snap.createTransactionToken(parameter);
    res.json({ paymentToken });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

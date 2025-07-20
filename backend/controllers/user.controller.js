import User from "../models/user.model.js";
import Registration from "../models/registration.model.js";
import Event from "../models/event.model.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      // --- PERBAIKAN DI SINI ---
      // Kirim semua data pengguna, bukan hanya sebagian
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        companyName: user.companyName,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const getUserProfile = async (req, res) => {
  const user = req.user;
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      address: user.address,
      companyName: user.companyName,
      token: generateToken(user._id),
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      participant: req.user._id,
    }).populate("event");
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const applyForOrganizer = async (req, res) => {
  const { phoneNumber, address, companyName } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.address = address || user.address;
      user.companyName = companyName || user.companyName;
      user.role = "organizer";

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getAllOrganizers = async (req, res) => {
  try {
    const topOrganizers = await Event.aggregate([
      // Tahap 1: Hitung jumlah acara untuk setiap organizer
      {
        $group: {
          _id: "$organizer", // Kelompokkan berdasarkan ID organizer
          eventCount: { $sum: 1 }, // Hitung jumlah event
        },
      },
      // Tahap 2: Urutkan berdasarkan jumlah acara (terbanyak ke tersedikit)
      {
        $sort: {
          eventCount: -1,
        },
      },
      // Tahap 3: Batasi hanya 5 hasil teratas
      {
        $limit: 5,
      },
      // Tahap 4: Ambil detail data user (nama, companyName) dari collection 'users'
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "organizerDetails",
        },
      },
      // Tahap 5: Ubah struktur data agar mudah digunakan di frontend
      {
        $project: {
          _id: 1,
          name: { $arrayElemAt: ["$organizerDetails.name", 0] },
          companyName: { $arrayElemAt: ["$organizerDetails.companyName", 0] },
          eventCount: 1,
        },
      },
    ]);

    res.json(topOrganizers);
  } catch (error) {
    console.error("GET TOP ORGANIZERS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getOrganizerProfile = async (req, res) => {
  try {
    // 1. Cari data organizer berdasarkan ID dari URL
    const organizer = await User.findById(req.params.id).select(
      "name companyName"
    );
    if (!organizer) {
      return res.status(404).json({ message: "Organizer tidak ditemukan" });
    }

    // 2. Cari semua acara yang dibuat oleh organizer tersebut
    const events = await Event.find({ organizer: req.params.id }).sort({
      date: -1,
    });

    // 3. Kirim kembali gabungan datanya
    res.json({ organizer, events });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (user.role === "organizer") {
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.address = req.body.address || user.address;
        user.companyName = req.body.companyName || user.companyName;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      // --- PERBAIKAN DI SINI ---
      // Kirim juga semua data yang sudah diperbarui
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
        companyName: updatedUser.companyName,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  getMyRegistrations,
  applyForOrganizer,
  getAllOrganizers,
  getOrganizerProfile,
  updateUserProfile,
};

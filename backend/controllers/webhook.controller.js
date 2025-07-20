import Registration from "../models/registration.model.js";

export const midtransNotification = async (req, res) => {
  try {
    const notification = req.body;
    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    console.log(
      `Webhook diterima. Order ID: ${orderId}, Status: ${transactionStatus}`
    );

    // Cari pendaftaran di database Anda berdasarkan orderId
    const registration = await Registration.findById(orderId);
    if (!registration) {
      console.error(`Pendaftaran dengan Order ID ${orderId} tidak ditemukan.`);
      // Kirim 404 tapi tetap respons 200 ke Midtrans agar tidak dikirim ulang
      return res.status(200).send("Registration not found, but acknowledged.");
    }

    // Perbarui status hanya jika pembayaran berhasil dan aman
    if (transactionStatus === "settlement" || transactionStatus === "capture") {
      if (fraudStatus === "accept") {
        registration.status = "paid";
        await registration.save();
        console.log(`Pendaftaran ${orderId} status diperbarui menjadi LUNAS.`);
      }
    } else if (
      transactionStatus === "expire" ||
      transactionStatus === "deny" ||
      transactionStatus === "cancel"
    ) {
      registration.status = "cancelled";
      await registration.save();
      console.log(
        `Pendaftaran ${orderId} status diperbarui menjadi DIBATALKAN.`
      );
    }

    // Selalu kirim respons 200 OK ke Midtrans
    res.status(200).send("OK");
  } catch (error) {
    console.error("WEBHOOK ERROR:", error.message);
    res.status(500).send("Terjadi kesalahan pada server");
  }
};

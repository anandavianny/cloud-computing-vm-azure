const express = require("express");
const routes = require("./routes");
const { checkDatabaseConnection } = require("./dbService");

const app = express();
const PORT = 3306;

// Middleware untuk parsing data form
app.use(express.urlencoded({ extended: true }));

// Middleware untuk routing
app.use("/", routes);

// Jalankan server
app.listen(PORT, async () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  await checkDatabaseConnection(); // Cek koneksi database saat server start
});

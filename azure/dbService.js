const sql = require("mssql");
const dbConfig = require("./dbConfig");

// Fungsi untuk mengecek koneksi database
async function checkDatabaseConnection() {
  try {
    console.log("🔄 Mencoba koneksi ke database...");
    const pool = await sql.connect(dbConfig);
    console.log("✅ Koneksi ke database berhasil!");
    pool.close();
  } catch (err) {
    console.error("❌ Gagal koneksi ke database:", err.message);
  }
}

// Fungsi untuk mengambil data artikel dari database
async function getArtikel() {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query("SELECT * FROM dbo.artikel");
    pool.close();
    return result.recordset;
  } catch (err) {
    throw new Error("Error mengambil data dari database: " + err.message);
  }
}

module.exports = {
  checkDatabaseConnection,
  getArtikel,
};

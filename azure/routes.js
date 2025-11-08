const express = require("express");
const sql = require("mssql");
const router = express.Router();

// Import konfigurasi database
const dbConfig = require("./dbConfig");

// Route: Halaman Utama - Menampilkan daftar artikel
router.get("/", async (req, res) => {
  try {
    console.log("🔄 Mengambil data dari tabel dbo.artikel...");
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query("SELECT * FROM dbo.artikel");

    console.log("✅ Data berhasil diambil, mengirimkan ke browser...");

    // Render data dalam HTML yang lebih menarik
    let html = `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Berita Terkini</title>
                  <style>
                      body {
                          font-family: Arial, sans-serif;
                          margin: 0;
                          padding: 0;
                          background-color: #f9f9f9;
                          color: #333;
                      }
                      header {
                          background-color: #007BFF;
                          color: white;
                          padding: 20px;
                          text-align: center;
                      }
                      header h1 {
                          margin: 0;
                          font-size: 2.5em;
                      }
                      .container {
                          max-width: 900px;
                          margin: 20px auto;
                          padding: 20px;
                          background: white;
                          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                          border-radius: 8px;
                      }
                      .article {
                          border-bottom: 1px solid #ddd;
                          padding: 15px 0;
                      }
                      .article:last-child {
                          border-bottom: none;
                      }
                      .article h2 {
                          margin: 0 0 10px;
                          font-size: 1.5em;
                          color: #007BFF;
                      }
                      .article p {
                          margin: 0 0 10px;
                          line-height: 1.6;
                      }
                      .article time {
                          font-size: 0.9em;
                          color: #666;
                      }
                      .add-button {
                          display: inline-block;
                          margin-bottom: 20px;
                          padding: 10px 20px;
                          font-size: 1em;
                          color: white;
                          background-color: #007BFF;
                          border: none;
                          border-radius: 5px;
                          text-decoration: none;
                          text-align: center;
                          cursor: pointer;
                      }
                      .add-button:hover {
                          background-color: #0056b3;
                      }
                  </style>
              </head>
              <body>
                  <header>
                      <h1>Berita Terkini</h1>
                  </header>
                  <div class="container">
                      <a href="/add" class="add-button">Tambah Artikel</a>
          `;

    result.recordset.forEach((row) => {
      html += `
                  <div class="article">
                      <h2>${row.judul}</h2>
                      <p>${row.isi}</p>
                      <time>${new Date(row.tanggal).toLocaleDateString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}</time>
                  </div>
              `;
    });

    html += `
                  </div>
              </body>
              </html>
          `;

    res.send(html);
  } catch (err) {
    console.error("❌ Error saat mengambil data dari database:", err.message);
    res.status(500).send("Gagal mengambil data: " + err.message);
  }
});

// Route: Halaman Tambah Artikel - Menampilkan Formulir
router.get("/add", (req, res) => {
  const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tambah Artikel</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                form { max-width: 500px; margin: 0 auto; }
                label { display: block; margin-bottom: 8px; }
                input, textarea { width: 100%; padding: 8px; margin-bottom: 16px; box-sizing: border-box; }
                button { background-color: #4CAF50; color: white; padding: 10px 20px; border: none; cursor: pointer; }
                button:hover { background-color: #45a049; }
            </style>
        </head>
        <body>
            <h1>Tambah Artikel Baru</h1>
            <form action="/submit" method="POST">
                <label for="judul">Judul:</label>
                <input type="text" id="judul" name="judul" required>
                
                <label for="isi">Isi:</label>
                <textarea id="isi" name="isi" rows="5" required></textarea>
                
                <label for="tanggal">Tanggal:</label>
                <input type="date" id="tanggal" name="tanggal" required>
                
                <button type="submit">Tambah Artikel</button>
            </form>
        </body>
        </html>
    `;
  res.send(html);
});

// Route: Menyimpan Artikel ke Database
router.post(
  "/submit",
  express.urlencoded({ extended: true }),
  async (req, res) => {
    const { judul, isi, tanggal } = req.body;

    try {
      console.log("🔄 Menyimpan artikel ke database...");
      const pool = await sql.connect(dbConfig);
      await pool
        .request()
        .input("judul", sql.NVarChar, judul)
        .input("isi", sql.NVarChar, isi)
        .input("tanggal", sql.Date, tanggal)
        .query(
          "INSERT INTO dbo.artikel (judul, isi, tanggal) VALUES (@judul, @isi, @tanggal)"
        );

      console.log("✅ Artikel berhasil ditambahkan!");
      res.redirect("/"); // Redirect ke halaman utama
    } catch (err) {
      console.error("❌ Gagal menyimpan artikel:", err.message);
      res.status(500).send("Gagal menyimpan artikel: " + err.message);
    }
  }
);

module.exports = router;

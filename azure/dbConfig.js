const dbConfig = {
  user: "davi", // Ganti dengan username database Anda
  password: "Ananda12345", // Ganti dengan password database Anda
  server: "databasedv.database.windows.net", // Ganti dengan server database Anda
  database: "dbdavi", // Ganti dengan nama database Anda
  options: {
    encrypt: true, // Wajib true jika menggunakan Azure SQL
    trustServerCertificate: false,
  },
};

module.exports = dbConfig;

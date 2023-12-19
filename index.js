const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const db = require("./connection");
const response = require("./response");
const middleware = (req, res, next) => {
  if (req.query.key == "123") {
    next();
  } else {
    res.json("require key");
  }
};

app.use(middleware, bodyParser.json());

app.get("/", (req, res) => {
  response(200, "API ready to go", "success", res);
});

app.get("/mahasiswa", (req, res) => {
  const sql = "SELECT * FROM mahasiswa";
  db.query(sql, (err, fields) => {
    if (err) throw err;
    response(200, fields, "get all data", res);
  });
});

app.get("/mahasiswa/:npm", (req, res) => {
  const npm = req.params.npm;
  const sql = `SELECT * FROM mahasiswa WHERE npm = ${npm}`;
  db.query(sql, (err, fields) => {
    if (err) throw err;
    response(200, fields, `by npm ${npm}`, res);
  });
});

app.post("/mahasiswa", (req, res) => {
  const { npm, namaLengkap, kelas, alamat } = req.body;
  const sql = `INSERT INTO mahasiswa (npm, nama_lengkap, kelas, alamat) VALUES (${npm}. '${namaLengkap}', '${kelas}', '${alamat}')`;
  db.query(sql, (err, fields) => {
    if (err) response(500, "invalid", "error".res);
    if (fields?.affectedRows) {
      const data = {
        isSuccess: fields.affectedRows,
        id: fields.insertId,
      };
      response(200, data, "post mahasiswa successfuly", res);
    }
  });
});

app.put("/mahasiswa", (req, res) => {
  const { npm, namaLengkap, kelas, alamat } = req.body;
  const sql = `UPDATE mahasiswa SET nama_lengkap = '${namaLengkap}', kelas = '${kelas}', alamat = '${alamat}' WHERE npm = ${npm}`;
  db.query(sql, (err, fields) => {
    if (err) response(500, "invalid", "error".res);
    if (fields?.affectedRows) {
      const data = {
        isSuccess: fields.affectedRows,
        message: fields.message,
      };
      response(200, data, "put mahasiswa successfuly", res);
    } else {
      response(404, "user not found", "error", res);
    }
  });
});

app.delete("/mahasiswa", (req, res) => {
  const { npm } = req.body;
  const sql = `DELETE FROM mahasiswa WHERE npm = ${npm}`;
  db.query(sql, (err, fields) => {
    if (err) response(500, "invalid", "error".res);
    if (fields?.affectedRows) {
      const data = {
        isSuccess: fields.affectedRows,
        message: fields.message,
      };
      response(200, data, "DELETE mahasiswa successfuly", res);
    } else {
      response(404, "user not found", "error", res);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

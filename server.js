const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const fileUpload = require("express-fileupload");
const mysql = require("mysql");
const { v4: uuidv4 } = require("uuid");

const PORT = 5000;

app.use(fileUpload());

app.use(express.static("upload"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  database: "image-uploader-yt",
  password: "root",
});

app.get("/", (req, res) => {
  // res.render("home", { layout: false });

  pool.getConnection((err, connection) => {
    if (err) throw err;

    console.log("DBと接続中・・・🌳");

    connection.query("SELECT * FROM image", (err, rows) => {
      connection.release();
      console.log(rows);
      if (!err) {
        res.render("home", { layout: false, rows });
      }
    });
  });
});

app.post("/", (req, res) => {
  let sampleFile;
  let uploadPath;

  if (!req.files) {
    return res.status(400).send("何も画像がアップロードされていません");
  }

  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + "/upload/" + sampleFile.name;
  console.log(sampleFile);

  //サーバーに画像ファイルを置く場所の指定
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    // res.send("ファイルをアップロードしました！");

    pool.getConnection((err, connection) => {
      if (err) throw err;

      console.log("DBと接続中・・・🌳");

      // connection.query(
      //   'UPDATE image SET image = ? WHERE id ="1"',
      //   [sampleFile.name],
      //   (err, rows) => {
      //     connection.release();
      //     if (!err) {
      //       res.redirect("/");
      //     } else {
      //       console.log(err);
      //     }
      //   }
      // );
      connection.query(
        `insert into image values ('${uuidv4()}', 'text','${
          sampleFile.name
        }','text','text');`,
        (err, rows) => {
          connection.release();
          if (!err) {
            res.redirect("/");
          } else {
            console.log(err);
          }
        }
      );
    });
  });
});

app.listen(PORT, () => console.log("running on server🚀"));

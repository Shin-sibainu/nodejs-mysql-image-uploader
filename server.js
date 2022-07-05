const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const fileUpload = require("express-fileupload");
const mysql = require("mysql");

const PORT = 5000;

app.use(fileUpload());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// connection pool

app.get("/", (req, res) => {
  res.render("home", { layout: false });
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

    res.send("ファイルをアップロードしました！");
  });
});

app.listen(PORT, () => console.log("running on server🚀"));

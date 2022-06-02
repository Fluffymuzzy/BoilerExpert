const express = require("express");
const mySql = require("mysql");
const app = express();
const port = 3000;
const hostname = "127.0.0.1";

app.listen(port, () => {
  console.log(`Server workin on http://${hostname}:${port}`);
});

const connect = mySql.createConnection({
  host: "localhost",
  user: "sqluser",
  password: "password",
  database: "data_base",
});

app.use(express.urlencoded());
app.use(express.json());

app.set("view engine", "pug");

app.use(express.static(__dirname + "/public"));
// MAIN PAGE
app.get("/", (req, res) => {
  res.render("main");
});


// CALLBACK FORM
app.get("/callbackForm", (req, res) => {
  res.render("callbackForm");
});

app.post("/finish-callback", function (req, res) {
  let data = req.body;
  let nowDate = Math.trunc(Date.now() / 1000);
  connect.query(
    `
    INSERT INTO callback (username, surname, number, date) VALUES ("${data.name}", "${data.surname}", ${data.number}, ${nowDate})
  `,
    function (err, result) {
      if (err) throw err;
    }
  );
});

app.get("/admin-callbacks", (req, res) => {
  connect.query(
    `SELECT id,username,surname,number,FROM_UNIXTIME(date, '%D %M %Y %H:%i:%s') as unix_timestamp 
     FROM callback
     ORDER BY id DESC
  `,
    function (err, result) {
      if (err) throw err;
      res.render("adminTable", {
        callbacks: JSON.parse(JSON.stringify(result)),
      });
    }
  );
});

// BTN

app.get("/btn-reset", (req, res) => {
  connect.query(
    `
  TRUNCATE TABLE callback
  `,
    function (err, result) {
      if (err) throw err;
      res.redirect("/admin-callbacks");
    }
  );
});

// PRICE LIST

app.get("/priceList", (req, res) => {
  res.render("priceList");
});

// PORTFOLIO

app.get("/portfolio", (req, res) => {
  res.render("portfolio");
});
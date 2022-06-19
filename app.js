// Connect EXPRESS
const express = require("express");
const app = express();
// const router = express.Router();

// Connect DATABASE
const mySql = require("mysql");

// HOST
const port = 3000;
const hostname = "127.0.0.1";

// module.exports = router;

app.listen(port, (err) => {
  if (err) {
    console.log("there was a problem", err);
    return;
  }
  console.log(`Server started on http://${hostname}:${port}`);
});

// create connection to db
const conn = mySql.createConnection({
  host: "localhost",
  user: "sqluser",
  password: "password",
  database: "data_base",
});
// adding middleware function for parsing requset body
app.use(express.urlencoded());
// reading json
app.use(express.json());

// adding static files to server
app.use(express.static("public"));

// adding pug
app.set("view engine", "pug");

// MAIN PAGE
app.get("/", (req, res) => {
  let goods = new Promise((resolve, reject) => {
    conn.query("SELECT * FROM goods ORDER BY id DESC LIMIT 3", (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
  Promise.all([goods]).then((value) => {
    console.log(value[0]);
    res.render("main", {
      goods: value[0],
    });
  });
});

// CATALOG PAGE
app.get("/catalogPage", (req, res) => {
  res.send("<h1>PIZDA<h1/>");
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
  conn.query(
    `
    SELECT id,username,surname,number,FROM_UNIXTIME(date, '%D %M %Y %H:%i:%s') as unix_timestamp 
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

// BTNS

app.get("/btn-reset", (req, res) => {
  conn.query(
    `
  TRUNCATE TABLE callback
  `,
    function (err, result) {
      if (err) throw err;
      res.redirect("/admin-callbacks");
    }
  );
});

app.get("");

// ****************************************************************

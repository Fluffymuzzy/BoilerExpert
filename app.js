// Connect EXPRESS
const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");

const responseHelper = require("express-response-helper").helper();

const main = require("./routes/mainRoutes");

// Connect DATABASE
const mySql = require("mysql");
const { log } = require("console");

// HOST
const port = 3000;
const hostname = "127.0.0.1";

module.exports = router;

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

app.use("/app", router);

// reading json
app.use(express.json());

// adding static files to server
app.use(express.static(path.join(__dirname, "public")));

// adding pug
app.set("view engine", "pug");

// MAIN PAGE
app.get("/", (req, res) => {
  let goods = new Promise((resolve, reject) => {
    conn.query(
      "SELECT * FROM goods ORDER BY id DESC LIMIT 3",
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
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
  let allGoods = new Promise((resolve, reject) => {
    conn.query(
      `SELECT id, goods_name, goods_image, goods_cost FROM goods ORDER BY id`,
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
  Promise.all([allGoods]).then((value) => {
    console.log(value[0]);
    res.render("catalogPage", {
      goods: value[0],
    });
  });
});

// PRODUCT PAGE
app.get("/productPage/:id", (req, res) => {
  let goodsId = req.params.id;
  let goodsData = new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM goods WHERE id=` + goodsId, function (
      err,
      result
    ) {
      if (err) reject(err);
      resolve(result);
    });
  });
  Promise.all([goodsData]).then((value) => {
    console.log([goodsData]);
    res.render("productPage", {
      goods: value[0],
    });
  });
});







// CALLBACK FORM
app.post("/finish-callback", function (req, res) {
  let data = req.body;
  let nowDate = Math.trunc(Date.now() / 1000);
  conn.query(
    `
    INSERT INTO callback (username, number, date) VALUES ("${data.name}", ${data.number}, ${nowDate})
  `,
    function (err, result) {
      if (err) throw err;
    }
  );
});

// ADMIN PANEL
app.route("/login").get((req, res) => {
  res.render("loginPage");
});

// app.post("/login", function (req, res) {
//   updateLoginHash(req, res);
// });

app.get("/admin", (req, res) => {
  res.render("adminStartPage");
});

app.get("/admin/admin-callbacks", (req, res) => {
  conn.query(
    `
    SELECT id,username,number,FROM_UNIXTIME(date, '%D %M %Y %H:%i:%s') as unix_timestamp 
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

// BTNS admin

app.get("/btn-reset", (req, res) => {
  conn.query(
    `
  TRUNCATE TABLE callback
  `,
    function (err, result) {
      if (err) throw err;
      res.redirect("/adminStartPage/admin-callbacks");
    }
  );
});

// shoppin cart

app.get("/shoppingCart", (req, res) => {
  res.render("shoppingCart");
});


app.post("/cartTest", (req, res) => {
  if (req.body.key != "undefined" && req.body.key.length != 0) {
    conn.query(
      "SELECT id, goods_name, goods_cost, goods_image FROM goods WHERE id IN (" +
        req.body.key.join(",") +
        ")",
      function (err, result, fields) {
        if (err) throw err;
        let goods = {};
        for (let i = 0; i < result.length; i++) {
          goods[result[i]["id"]] = result[i];
        }
        res.json(goods);
      }
    );
  } else {
    res.send("0");
  }
});

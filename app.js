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

// ADMIN PANEL
// app.route("/login").get((req, res) => {
//   res.render("loginPage");
// });

// app.post("/login", function (req, res) {
//   updateLoginHash(req, res);
// });

app.get("/admin", (req, res) => {
  res.render("adminStartPage");
});

// rendering callback page

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

// saving callback from client to db

app.post("/finish-callback", (req, res) => {
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

// BTNS admin

app.get("/btn-reset", (req, res) => {
  conn.query(
    `
  TRUNCATE TABLE callback
  `,
    function (err, result) {
      if (err) throw err;
      res.redirect("/admin/admin-callbacks");
    }
  );
});

// shoppin cart

app.get("/shoppingCart", (req, res) => {
  res.render("shoppingCart");
});

// rendering order table

app.get("/admin/orderPage", (req, res) => {
  conn.query(
    `SELECT
          orders.id as id,
          orders.goods_name as goods_name,
          orders.goods_cost as goods_cost,
          orders.goods_amount as goods_amount,
          orders.total as total,
          from_unixtime(date, '%D %M %Y %H:%i:%s') as unix_timestapm,
          users.user_name as user,
          users.user_phone as phone,
          users.adress as adress
          FROM 
            orders
          LEFT JOIN	
            users
            ON orders.user_id = orders.id ORDER BY id DESC
    `,
    function (err, result) {
      if (err) throw err;
      res.render("adminOrderPage", {
        orders: JSON.parse(JSON.stringify(result)),
      });
    }
  );
});

// saving order to db

app.post("/finish-order", (data, res) => {
  let sqlReq;

  sqlReq = `INSERT INTO users (user_name, user_email, user_phone, adress) VALUES ('${data.userName}','${data.email}','${data.phoneNumber}','${data.adress}')`;

  conn.query(sqlReq, (err, result) => {
    if (err) throw err;
    let userId = result.insertId;
    let nowDate = Math.trunc(Date.now() / 1000);
    for (let i = 0; i < res.length; i++) {
      sqlReq = `INSERT INTO orders (date,user_id,goods_id,goods_cost,goods_amount,total) 
     VALUES ('${nowDate}, ${userId}, ${res[i]["id"]}, ${
        res[i]["goods_cost"]
      }, ${data.key[res[i]["id"]]}, ${
        data.key[res[i]["id"]] * res[i]["goods_cost"]
      }')`;
      conn.query(sqlReq, (err, result) => {
        if (err) throw err;
      });
    }
  });
});

// showin data from db in cart

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

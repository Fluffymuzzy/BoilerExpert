// Connect EXPRESS
const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const responseHelper = require("express-response-helper").helper();
const cookie = require("cookie-parser");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// require(".dotenv").config();

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

app.use(responseHelper);

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
    res.render("productPage", {
      goods: value[0],
    });
  });
});

// ADMIN PANEL

app.get("/admin", (req, res) => {
  res.render("adminStartPage");
});

app.get("/admin/adminProducts", (req, res) => {
  res.render("adminProducts");
});

// login

app.get("/login", (req, res) => {
  res.render("adminLoginPage");
});

function generateHash(length) {
  let res = "";
  let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charLength = char.length;
  for (let i = 0; i < length; i++) {
    res += char.charAt(Math.floor(Math.random() * charLength));
  }
  console.log(res);
}

app.post("/login", (req, res) => {
  conn.query(
    `SELECT * FROM admin WHERE login = '${req.body.login}' and password = '${req.body.password}'`,
    (err, result) => {
      if (err) throw err;

      if (result.length == 0 || result == null) {
        res.redirect("/login");
        // console.log(result);
      } else {
        result = JSON.parse(JSON.stringify(result));
        let hash = generateHash(32);
        res.cookie("hash", hash);
        res.cookie("id", result[0]["id"]);
        let sqlReq = `UPDATE admin SET hash = '${hash}' WHERE id = '${result[0]["id"]}'`;

        conn.query(sqlReq, (err, result) => {
          if (err) throw err;
          // res.redirect("/login");
          console.log(result);
          res.send(200);
        });
      }
    }
  );
});

function hashValidation(req, res, next) {
  if (req.cookies.id === undefined || req.cookies.hash === undefined) {
    return;
  }
  conn.query(
    `SELECT * FROM admin WHERE id=${req.cookies.id} and hash='${req.cookies.hash}'`,
    (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.redirect("/login");
      } else {
        next();
      }
    }
  );
}

// edit product

app.get("/admin/adminProducts/editProducts", (req, res) => {
  let allGoods = new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM goods ORDER BY id`, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
  Promise.all([allGoods]).then((value) => {
    res.render("adminEditProductsPage", {
      goods: value[0],
    });
  });
});

app.get("/admin/adminProducts/editProducts/:id", (req, res) => {
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
    res.render("adminEditProduct", {
      goods: value[0],
    });
  });
});

app.get("/deleteProduct/:id", (req, res) => {
  let Id = req.params.id;
  conn.query(
    `
    DELETE FROM goods WHERE id=` + Id,
    (err, result) => {
      if (err) throw err;
      res.redirect("/admin/adminProducts/editProducts");
    }
  );
});

app.post("/admin/adminProducts/editProducts/editThisProduct", (req, res) => {
  conn.query(
    `
    UPDATE goods
    SET goods_name = '${req.body.name}',
        goods_image = '${req.body.image}',
        goods_cost = '${req.body.cost}',
        goods_article = '${req.body.article}',
        goods_warranty = '${req.body.warranty}',
        goods_dimensions = '${req.body.dimensions}',
        goods_heatingPower = '${req.body.heatingPower}',
        goods_heatingType = '${req.body.heatingType}'
    WHERE id = ${req.body.id}
    `,
    (err, result) => {
      if (err) throw err;
      res.status(201);
    }
  );
});

// сreate product

app.get("/admin/adminProducts/addingProducts", (req, res) => {
  res.render("adminAddingProductsPage");
});

app.post("/admin/adminProducts/addingProducts/addNewProduct", (req, res) => {
  console.log(req.body);
  conn.query(
    `
    INSERT into goods (goods_name, goods_cost, goods_article, goods_image, goods_warranty, goods_dimensions, goods_heatingPower, goods_heatingType ) 
    VALUES ('${req.body.name}','${req.body.cost}','${req.body.article}', '${req.body.image}', '${req.body.warranty}', '${req.body.dimensions}', '${req.body.heatingPower}', '${req.body.heatingType}') 
    `,
    (err, result) => {
      if (err) throw err;
      res.status(201);
      res.redirect("/admin");
    }
  );
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

app.get("/btn-reset-orders", (req, res) => {
  conn.query(
    `
  TRUNCATE TABLE orders
  `,
    function (err, result) {
      if (err) throw err;
      res.redirect("/admin/orderPage");
    }
  );
});

// SHOPPIN CART

app.get("/shoppingCart", (req, res) => {
  res.render("shoppingCart");
});

// rendering order table

app.get("/admin/orderPage", (req, res) => {
  conn.query(
    `SELECT
          orders.id as id,
          orders.user_id as user_id,
          orders.goods_id as goods_id,
          orders.goods_article as goods_article,
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
            ON orders.user_id = users.id ORDER BY id DESC
    `,
    function (err, result, fields) {
      if (err) throw err;
      res.render("adminOrderPage", {
        orders: JSON.parse(JSON.stringify(result)),
      });
    }
  );
});

// showin data from db in cart

app.post("/cartTest", (req, res) => {
  if (req.body.key != "undefined" && req.body.key.length != 0) {
    conn.query(
      "SELECT id, goods_name, goods_cost, goods_article, goods_image FROM goods WHERE id IN (" +
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

// saving order to db

function saveOrder(data, res) {
  let sqlReq;

  sqlReq = `INSERT INTO users ( user_name, user_email, user_phone, adress) VALUES ('${data.userName}','${data.email}','${data.phoneNumber}','${data.adress}')`;

  conn.query(sqlReq, (err, result) => {
    if (err) throw err;
    let userId = result.insertId;
    let nowDate = Math.trunc(Date.now() / 1000);
    for (let i = 0; i < res.length; i++) {
      sqlReq = `INSERT INTO orders (date,user_id, goods_id, goods_cost,goods_amount,total) 
     VALUES (${nowDate}, ${userId}, ${res[i]["id"]}, ${res[i]["goods_cost"]}, ${
        data.key[res[i]["id"]]
      }, ${data.key[res[i]["id"]] * res[i]["goods_cost"]})`;
      conn.query(sqlReq, (err, result) => {
        if (err) throw err;
      });
    }
  });
}

// save data from cart

function saveDataFromOrder(req, res) {
  let keys;
  if (req.body.key != null) {
    keys = Object.keys(req.body.key);
  } else {
    keys = {};
  }

  if (keys.length > 0) {
    conn.query(
      "SELECT id, goods_name, goods_cost, goods_article FROM goods WHERE id IN (" +
        keys.join(",") +
        ")",
      (err, result, fields) => {
        if (err) throw err;
        saveOrder(req.body, result);
        res.respond(200);
        return result;
      }
    );
  } else if (keys.length == 0 || keys.length == undefined) {
    res.fail();
  }
}

app.post("/endOfOrder", (req, res) => {
  saveDataFromOrder(req, res);
});

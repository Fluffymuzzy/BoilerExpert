const conn = require("../sqlConfig");

// admin add new product

const addNewProduct = (req, res) => {
  console.log(req.body);
  conn.query(
    `
        INSERT into goods (goods_name, goods_cost, goods_article, goods_type, goods_liter, goods_image, goods_image2, goods_image3, goods_warranty, goods_dimensions, goods_heatingPower, goods_heatingType ) 
        VALUES ('${req.body.name}','${req.body.cost}','${req.body.article}', '${req.body.type}', '${req.body.liter}', '${req.body.image}', '${req.body.image2}', '${req.body.image3}', '${req.body.warranty}', '${req.body.dimensions}', '${req.body.heatingPower}', '${req.body.heatingType}') 
        `,
    (err, result) => {
      if (err) throw err;
      res.status(201);
      res.redirect("/admin");
    }
  );
};

// admin callbacks

const callbacks = (req, res) => {
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
};

const endCallback = (req, res) => {
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
};

const callbackReset = (req, res) => {
  conn.query(
    `
      TRUNCATE TABLE callback
      `,
    function (err, result) {
      if (err) throw err;
      res.redirect("/admin/callbacks");
    }
  );
};

// admin edit product

const editProducts = (req, res) => {
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
};

const editProductById = (req, res) => {
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
};

const deleteThisProduct = (req, res) => {
  let Id = req.params.id;
  conn.query(
    `
      DELETE FROM goods WHERE id=` + Id,
    (err, result) => {
      if (err) throw err;
      res.redirect("/admin/products/edit");
    }
  );
};

const pressEditThisProduct = (req, res) => {
  conn.query(
    `
        UPDATE goods
        SET goods_name = '${req.body.name}',
            goods_image = '${req.body.image}',
            goods_image2 = '${req.body.image2}',
            goods_image3 = '${req.body.image3}',
            goods_cost = '${req.body.cost}',
            goods_article = '${req.body.article}',
            goods_type = '${req.body.type}',
            goods_liter = '${req.body.liter}',
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
};

// admin orders

const orders = (req, res) => {
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
};

const deleteOrders = (req, res) => {
  conn.query(
    `
      TRUNCATE TABLE orders
      `,
    function (err, result) {
      if (err) throw err;
      res.redirect("/admin/orders");
    }
  );
};

module.exports = {
  addNewProduct,
  callbacks,
  endCallback,
  callbackReset,
  editProducts,
  editProductById,
  deleteThisProduct,
  pressEditThisProduct,
  orders,
  deleteOrders,
};

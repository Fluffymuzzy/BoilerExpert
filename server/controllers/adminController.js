const conn = require("../sqlConfig");

// admin add new product
const addNewProduct = (req, res) => {
  try {
    const {
      name,
      cost,
      article,
      type,
      liter,
      image,
      image2,
      image3,
      warranty,
      dimensions,
      heatingPower,
      heatingType,
    } = req.body;
    conn.query(
      "INSERT INTO goods (goods_name, goods_cost, goods_article, goods_type, goods_liter, goods_image, goods_image2, goods_image3, goods_warranty, goods_dimensions, goods_heatingPower, goods_heatingType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        cost,
        article,
        type,
        liter,
        image,
        image2,
        image3,
        warranty,
        dimensions,
        heatingPower,
        heatingType,
      ]
    );
    res.status(201).redirect("/admin");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// admin callbacks
const getCallbacks = (req, res) => {
  try {
    const query =
      "SELECT id, username, number, FROM_UNIXTIME(date, '%D %M %Y %H:%i:%s') as unix_timestamp FROM callback ORDER BY id DESC";
    const result = conn.query(query);
    const callbacks = JSON.parse(JSON.stringify(result));
    res.render("adminTable", { callbacks });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const addCallback = (req, res) => {
  try {
    const { name, number } = req.body;
    const now = Math.trunc(Date.now() / 1000);
    const query =
      "INSERT INTO callback (username, number, date) VALUES (?, ?, ?)";
    conn.query(query, [name, number, now]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const resetCallbacks = (req, res) => {
  try {
    const query = "TRUNCATE TABLE callback";
    conn.query(query);
    res.redirect("/admin/callbacks");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// admin edit product
const editProducts = (req, res) => {
  try {
    const goods = conn.query(`SELECT * FROM goods ORDER BY id`);
    res.render("adminEditProductsPage", { goods });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const editProductById = (req, res) => {
  const goodsId = req.params.id;
  try {
    const goods = conn.query(`SELECT * FROM goods WHERE id=${goodsId}`);
    res.render("adminEditProduct", { goods: goods[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const deleteThisProduct = (req, res) => {
  const goodsId = req.params.id;
  try {
    conn.query(`DELETE FROM goods WHERE id=${goodsId}`);
    res.redirect("/admin/products/edit");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const pressEditThisProduct = (req, res) => {
  const {
    name,
    image,
    image2,
    image3,
    cost,
    article,
    type,
    liter,
    warranty,
    dimensions,
    heatingPower,
    heatingType,
    id,
  } = req.body;
  try {
    conn.query(`
      UPDATE goods
      SET goods_name='${name}',
          goods_image='${image}',
          goods_image2='${image2}',
          goods_image3='${image3}',
          goods_cost='${cost}',
          goods_article='${article}',
          goods_type='${type}',
          goods_liter='${liter}',
          goods_warranty='${warranty}',
          goods_dimensions='${dimensions}',
          goods_heatingPower='${heatingPower}',
          goods_heatingType='${heatingType}'
      WHERE id=${id}
    `);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// admin orders
const getOrders = async () => {
  const query = `
    SELECT
      orders.id,
      orders.user_id,
      orders.goods_id,
      orders.goods_article,
      orders.goods_cost,
      orders.goods_amount,
      orders.total,
      from_unixtime(date, '%D %M %Y %H:%i:%s') as unix_timestamp,
      users.user_name,
      users.user_phone,
      users.address
    FROM 
      orders
    LEFT JOIN	
      users ON orders.user_id = users.id
    ORDER BY orders.id DESC;
  `;
  const [rows] = conn.query(query);
  return rows;
};

const renderAdminOrderPage = (req, res) => {
  try {
    const orders = getOrders();
    res.render("adminOrderPage", { orders });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteOrders = async (req, res) => {
  try {
    conn.query("TRUNCATE TABLE orders");
    res.redirect("/admin/orders");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  addNewProduct,
  getCallbacks,
  addCallback,
  resetCallbacks,
  editProducts,
  editProductById,
  deleteThisProduct,
  pressEditThisProduct,
  getOrders,
  deleteOrders,
  renderAdminOrderPage,
};

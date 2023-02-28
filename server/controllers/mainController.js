const conn = require("../sqlConfig");

// trying to get the data from the database and then render it on the page

const mainPageGoods = async (req, res) => {
  try {
    const goods = await new Promise((resolve, reject) => {
      conn.query(
        "SELECT * FROM goods ORDER BY id DESC LIMIT 3",
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
    res.render("main", {
      goods,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching goods");
  }
};

// render catalog page and
// paginate the results of a query.

const resPerPage = 6;

const catalogPage = async (req, res) => {
  try {
    const allGoods = await new Promise((resolve, reject) => {
      conn.query(`SELECT * FROM goods ORDER BY id `, (err, result) => {
        if (err) reject(err);
        const numOfResults = result.length;
        const numberOfPages = Math.ceil(numOfResults / resPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;
        if (page > numberOfPages) {
          res.redirect(`/catalog?page=` + encodeURIComponent(numberOfPages));
        } else if (page < 1) {
          res.redirect(`/catalog?page=` + encodeURIComponent("1"));
        }

        const startingLimit = (page - 1) * resPerPage;
        console.log(resPerPage);

        conn.query(
          `SELECT * FROM goods ORDER BY id LIMIT ${startingLimit}, ${resPerPage}`,

          (err, result) => {
            if (err) reject(err);
            let iterator = page - 5 < 1 ? 1 : page - 5;
            let endingLink =
              iterator + 9 <= numberOfPages
                ? iterator + 9
                : page + (numberOfPages - page);
            if (endingLink < page + 4) {
              iterator -= page + 4 - numberOfPages;
            }
            let resArr = Object.values(JSON.parse(JSON.stringify(result)));
            let pagesArr = [
              {
                page: page,
                numberOfPages: numberOfPages,
              },
            ];
            resolve([resArr, pagesArr]);
            console.log([resArr, pagesArr]);
          }
        );
      });
    });

    const types = await new Promise((resolve, reject) => {
      conn.query(
        `SELECT DISTINCT goods_type FROM goods ORDER BY id`,
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });

    res.render("catalogPage", {
      goods: allGoods[0],
      types,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching catalog");
  }
};

// get the data from the database and then render it on the product page
const productPage = (req, res) => {
  try {
    const goodsId = req.params.id;
    const goodsData = conn.query(`SELECT * FROM goods WHERE id=${goodsId}`);
    res.render("productPage", {
      goods: goodsData[0],
    });
  } catch (err) {
    console.log("Error:", err);
    res.render("errorPage");
  }
};

//  If the request body contains a key, then select the id, goods_name, goods_cost, goods_article, and
// goods_image from the goods table where the id is in the request body key.
const showCart = (req, res) => {
  const { key } = req.body;

  if (key && key.length > 0) {
    const ids = key.join(",");
    const query = `SELECT id, goods_name, goods_cost, goods_article, goods_image FROM goods WHERE id IN (${ids})`;

    conn.query(query, (err, result) => {
      if (err) {
        console.log("Error:", err);
        res.send("0");
        return;
      }
      const goods = {};
      result.forEach((item) => {
        goods[item.id] = item;
      });
      res.json(goods);
    });
  } else {
    res.send("0");
  }
};

// It takes the data from the cart, checks if the data is not empty, and if it's not empty, it saves
// the data to the database.

const saveDataFromCart = (req, res) => {
  let keys = Object.keys(req.body.key || {});

  if (keys.length === 0) {
    res.fail();
    return;
  }

  conn.query(
    "SELECT id, goods_name, goods_cost, goods_article FROM goods WHERE id IN (" +
      keys.join(",") +
      ")",
    (err, result) => {
      if (err) {
        throw err;
      }

      saveOrder(req.body, result);
      res.respond(200);
    }
  );
};

module.exports = {
  mainPageGoods,
  catalogPage,
  productPage,
  showCart,
  saveDataFromCart,
};

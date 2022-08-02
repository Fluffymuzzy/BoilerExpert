const conn = require("../sqlConfig");

// I'm trying to get the data from the database and then render it on the page

const mainPageGoods = (req, res) => {
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
};

// render catalog page and
// i'm trying to paginate the results of a query.

const resPerPage = 4;
const catalogPage = (req, res) => {
  let allGoods = new Promise((resolve, reject) => {
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

  let types = new Promise((resolve, reject) => {
    conn.query(
      `SELECT DISTINCT goods_type FROM goods ORDER BY id`,
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });

  Promise.all([allGoods, types]).then((value) => {
    res.render("catalogPage", {
      goods: value[0],
      types: value[1],
    });
  });
};

// get the data from the database and then render it on the product page

const productPage = (req, res) => {
  let goodsId = req.params.id;
  let goodsData = new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM goods WHERE id=` + goodsId, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
  Promise.all([goodsData]).then((value) => {
    console.log(value);
    res.render("productPage", {
      goods: value[0],
    });
  });
};

/**
 * If the request body contains a key, then select the id, goods_name, goods_cost, goods_article, and
 * goods_image from the goods table where the id is in the request body key.
 * @param req - request
 * @param res - the response object
 */
const showCart = (req, res) => {
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
};

/**
 * It takes the data from the cart, checks if the data is not empty, and if it's not empty, it saves
 * the data to the database.
 * @param req - {
 * @param res - {
 */
const saveDataFromCart = (req, res) => {
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
      }
    );
  } else if (keys.length == 0 || keys.length == undefined) {
    res.fail();
  }
};

module.exports = {
  mainPageGoods,
  catalogPage,
  productPage,
  showCart,
  saveDataFromCart
};

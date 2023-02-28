const conn = require("./sqlConfig");

function saveOrder(data, res) {
  let sqlReq = `INSERT INTO users ( user_name, user_email, user_phone, adress) VALUES (?, ?, ?, ?)`;

  conn.query(
    sqlReq,
    [data.userName, data.email, data.phoneNumber, data.adress],
    (err, result) => {
      if (err) throw err;
      let userId = result.insertId;
      let nowDate = Math.trunc(Date.now() / 1000);

      for (let i = 0; i < res.length; i++) {
        sqlReq = `INSERT INTO orders (date, user_id, goods_id, goods_article, goods_cost, goods_amount, total) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [
          nowDate,
          userId,
          res[i]["id"],
          res[i]["goods_article"],
          res[i]["goods_cost"],
          data.key[res[i]["id"]],
          data.key[res[i]["id"]] * res[i]["goods_cost"],
        ];
        conn.query(sqlReq, values, (err, result) => {
          if (err) throw err;
        });
      }
    }
  );
}

module.exports = { saveOrder };

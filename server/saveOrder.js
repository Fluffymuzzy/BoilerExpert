const conn = require("../../sqlConfig");

/// saving users info and order to db
module.exports = function saveOrder(data, res) {
    let sqlReq;
  
    sqlReq = `INSERT INTO users ( user_name, user_email, user_phone, adress) VALUES ('${data.userName}','${data.email}','${data.phoneNumber}','${data.adress}')`;
  
    conn.query(sqlReq, (err, result) => {
      if (err) throw err;
      let userId = result.insertId;
      let nowDate = Math.trunc(Date.now() / 1000);
      for (let i = 0; i < res.length; i++) {
        sqlReq = `INSERT INTO orders (date,user_id, goods_id, goods_article, goods_cost,goods_amount,total) 
       VALUES (${nowDate}, ${userId}, '${res[i]["id"]}', '${
          res[i]["goods_article"]
        }', '${res[i]["goods_cost"]}', ${data.key[res[i]["id"]]}, ${
          data.key[res[i]["id"]] * res[i]["goods_cost"]
        })`;
        conn.query(sqlReq, (err, result) => {
          if (err) throw err;
        });
      }
    });
  }
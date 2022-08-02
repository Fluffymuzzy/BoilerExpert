const conn = require("../sqlConfig");

// login
function generateHash(length) {
  let res = "";
  let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charLength = char.length;
  for (let i = 0; i < length; i++) {
    res += char.charAt(Math.floor(Math.random() * charLength));
  }
  return res;
}

const hashValidation = (req, res, next) => {
  if (req.cookies.id === undefined || req.cookies.hash === undefined) {
    res.redirect("/login");
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
};

const updateLoginHash = (req, res) => {
  conn.query(
    `SELECT * FROM admin WHERE login = '${req.body.login}' and password = '${req.body.password}'`,
    (err, result) => {
      if (err) throw err;
      if (result.length == 0 || result == null) {
        res.redirect("/login");
      } else {
        result = JSON.parse(JSON.stringify(result));
        let hash = generateHash(32);
        let id = result[0]["id"];
        res.cookie("hash", hash);
        res.cookie("id", id);
        let sqlReq = `UPDATE admin SET hash = '${hash}' WHERE id = '${id}'`;

        conn.query(sqlReq, (err, result) => {
          if (err) throw err;
          console.log(result);
          res.redirect("/admin");
        });
      }
    }
  );
};

// login

module.exports = { hashValidation, updateLoginHash };

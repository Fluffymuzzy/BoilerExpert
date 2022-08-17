const conn = require("../sqlConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// login
// const login = async (req, res) => {
//   const { login, password } = req.body;
//   let getPassword = [];

//   conn.query(`SELECT * FROM admin WHERE login = '${login}'`, (err, result) => {
//     if (err) throw err;
//     getPassword.push(JSON.parse(JSON.stringify(result))[0].password);
//   });
//   console.log(getPassword);
//   const hash = await bcrypt.hash(password, 8);
//   //   conn.query(
//   //     `INSERT `
//   //   )
// };

const login = async (req, res) => {
  let { login, password } = req.body;
  // console.log(password);

  let getPassword = new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM admin WHERE login = '${login}'`,
      (err, result) => {
        if (err) reject(err);
        result = JSON.parse(JSON.stringify(result[0].password));
        // console.log(result);
        // console.log(password);

        bcrypt.hash(result, 8).then((hash) => {
          conn.query(
            `UPDATE admin SET password = '${hash}' WHERE login = '${login}'`,
            (err, result) => {
              if (err) throw err;
              res.status(200);
            }
          );
        });

       
        

        bcrypt.compare(password, dbPassword).then((match) => {
          if (!match) {
            res.status(400).json({ error: "wrong !" });
          } else {
            res.status(200).json("vse ok");
          }
        });
      }
    );
  });
  // Promise.all([getPassword]).then((value) => {
  //   console.log(value);
  // });
};

module.exports = {
  login,
};

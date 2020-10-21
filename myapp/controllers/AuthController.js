const jwtHelper = require("../helpers/jwt.helper");
const { MongoClient, ObjectId } = require('mongodb')
const bcrypt = require('bcrypt')
const uri = 'mongodb://localhost:27017/Demo_CRUD_Project'

// Thời gian sống của token
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example";

//login
let login = async (req, res) => {
  try {
    MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {//connect tới database để lấy list user
      if (!err) {
        client.db('Demo_CRUD_Project').collection('users').find().toArray((err, val) => {//load list user lưu vào biến val
          if (!err) {
            let existUser = false//biến để kiểm tra user có tồn tại hay ko
            if (val.length > 0) {//đảm bảo list user không rỗng
              val.forEach(async (element) => {//duyệt qua list user
                if (element.userName === req.body.userName) {//nếu user có trong list thì check pass, nếu không res User not found
                  existUser = true//user có trong list
                  bcrypt.compare(req.body.password, element.password, async (err, val) => {//mã hóa pass được nhập vào và compare với pass trong database
                    if (val) {//compare true thì tạo token, compare false thì res Password is incorrect
                      const accessToken = await jwtHelper.generateToken(element, accessTokenSecret, accessTokenLife);//generate token
                      client.db('Demo_CRUD_Project').collection('users')//lưu token vào usser trong database
                        .findOneAndUpdate(
                          { "_id": ObjectId(element._id) },
                          { $set: { "token": accessToken } },
                          { upsert: false }
                        )
                      return res.status(200).json({//res đăng nhập thành công và token
                        message: "Đăng nhập thành công",
                        accessToken
                      });
                    } else return res.status(500).json({ message: 'Password is incorrect.' });
                  })
                }
              });
              if (existUser == false) {
                return res.status(500).json({ message: 'User not found.' });
              }
            }
          }
        })
      }
    })
  } catch (err) {
    return res.status(500).json({
      message: "Đăng nhập thất bại",
      error: err
    });
  }
}

module.exports = {
  login: login
}
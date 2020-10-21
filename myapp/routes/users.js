const express = require('express');
var router = express.Router();
const { MongoClient, ObjectId } = require('mongodb')
const User = require('../models/usersModel');
const bcrypt = require('bcrypt')
const AuthMiddleWare = require("./../middleware/AuthMiddleware");
const AuthController = require("./../controllers/AuthController");

const uri = 'mongodb://localhost:27017/Demo_CRUD_Project'

//login
router.post("/login", (req, res, next) => {
  AuthController.login(req, res)
});

router.use(AuthMiddleWare.isAuth);//kiểm tra auth. Nếu không có token thì không cho thực hiện các thao tác CRUD


//create user
router.post('/', (req, res, next) => {
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (!err) {
      let user = new User();
      bcrypt.hash(req.body.password, 10, function (err, hash) {
        user.password = hash
      });
      user.userName = req.body.userName != undefined ? req.body.userName : '';
      user.fullName = req.body.fullName != undefined ? req.body.fullName : '';
      user.tel = req.body.tel != undefined ? req.body.tel : 0;
      user.role = req.body.role != undefined ? req.body.role : 'EMPLOYMENT';
      user.token = '';
      console.log(req.body);

      if (req.body.userName === '' || req.body.userName == undefined || req.body.password === '' || req.body.password === undefined) {
        return res.status(500).json({
          message: "userName or password is required",
        })
      }
      setTimeout(() => {
        client.db('Demo_CRUD_Project').collection('users').insertOne(user, (err, val) => {
          if (err) {
            return res.status(500).json({
              message: "Thêm user mới thất bại",
              error: err
            })
          } else {
            return res.status(201).json({
              message: "Thêm user mới thành công",
              value: val.ops[0]
            })
          }
      })
      }, 1000);

    } else console.log('KHÔNG THỂ KẾT NỐI DATABASE:......' + err);
  })
})

//get all users
router.get('/', (req, res, next) => {
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (!err) {
      client.db('Demo_CRUD_Project').collection('users').find().toArray((err, val) => {
        if (!err) {
          res.send(val);
        } else res.send('Lỗi: ' + err)
      })
    } else console.log('KHÔNG THỂ KẾT NỐI DATABASE:......' + err);
  })
})

//get user by Id
router.get('/:id', (req, res, next) => {
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (!err) {
      client.db('Demo_CRUD_Project').collection('users').findOne({ "_id": ObjectId(req.params.id) }, (err, val) => {
        if (!err) {
          res.send(val);
        } else res.send('Lỗi: ' + err)
      })
    } else console.log('KHÔNG THỂ KẾT NỐI DATABASE:......' + err);
  })
})

// //update user
router.put('/', (req, res, next) => {
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (!err) {
      client.db('Demo_CRUD_Project').collection('users')
        .findOneAndUpdate(
          { "_id": ObjectId(req.body.criteria._id) },
          { $set: req.body.data },
          { upsert: false },
          (err, val) => {
            if (err) {
              res.status(500).json({
                message: "cập nhật thất bại",
                error: err
              })
            } else {
              res.send('Cập nhật thành công')
            }
          }
        )
    } else console.log('KHÔNG THỂ KẾT NỐI DATABASE:......' + err);
  })
})

//delete user
router.delete('/:_id', (req, res, next) => {
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (!err) {
      client.db('Demo_CRUD_Project').collection('users').findOneAndDelete({ "_id": ObjectId(req.params._id) }).then(res.send(`Đã xóa user ${req.body._id}`))
    } else console.log('KHÔNG THỂ KẾT NỐI DATABASE:......' + err);
  })
})

module.exports = router;

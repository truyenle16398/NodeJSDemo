const express = require('express');
var router = express.Router();
const { MongoClient, ObjectId } = require('mongodb')
const City = require('../models/cityModel');
const uri = 'mongodb://localhost:27017/Demo_CRUD_Project'

//get all cities
router.get('/', (req, res, next) => {
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (!err) {
      client.db('Demo_CRUD_Project').collection('cities').find().toArray((err, val) => {
        if (!err) {
          res.send(val);
        } else res.send('Lỗi: ' + err)
      })
    } else console.log('KHÔNG THỂ KẾT NỐI DATABASE:......' + err);
  })
})

//create city
router.post('/', (req, res, next) => {
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (!err) {
      let city = new City();
      city.cityName = req.body.cityName != undefined ? req.body.cityName : '';
      city.cityCode = req.body.cityCode != undefined ? req.body.cityCode : '';
      city.shortDescription = req.body.shortDescription != undefined ? req.body.shortDescription : '';
      city.detailDescription = req.body.detailDescription != undefined ? req.body.detailDescription : '';
      city.startCount = req.body.startCount != undefined ? req.body.startCount : 0;
      city.reviewCount = req.body.reviewCount != undefined ? req.body.reviewCount : 0;
      // city.image = req.body.image != undefined ? req.body.image : "";
      city.image.thumnail = req.body.image.thumnail != undefined ? req.body.image.thumnail : '';
      city.image.cover = req.body.image.cover != undefined ? req.body.image.cover : '';
      city.image.gallary = req.body.image.gallary != undefined ? req.body.image.gallary : [];
      console.log(req.body);

      if (req.body.cityName === '' || req.body.cityName == undefined || req.body.cityCode === '' || req.body.cityCode === undefined) {
        return res.status(500).json({
          message: "cityCode and cityName is required",
        })
      }
      setTimeout(() => {
        client.db('Demo_CRUD_Project').collection('cities').insertOne(city, (err, val) => {
          if (err) {
            return res.status(500).json({
              message: "Thêm mới thất bại",
              error: err
            })
          } else {
            return res.status(201).json({
              message: "Thêm mới thành công",
              value: val.ops[0]
            })
          }
        })
      }, 1000);
    } else console.log('KHÔNG THỂ KẾT NỐI DATABASE:......' + err);
  })
})

//get city by Id
router.get('/:id', (req, res, next) => {
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (!err) {
      client.db('Demo_CRUD_Project').collection('cities').findOne({ "_id": ObjectId(req.params.id) }, (err, val) => {
        if (!err) {
          res.send(val);
        } else res.send('Lỗi: ' + err)
      })
    } else console.log('KHÔNG THỂ KẾT NỐI DATABASE:......' + err);
  })
})

//update city
router.put('/', (req, res, next) => {
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (!err) {
      client.db('Demo_CRUD_Project').collection('cities')
        .findOneAndUpdate(
          { "_id": ObjectId(req.body._id) },
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

//delete city
router.delete('/:_id', (req, res, next) => {
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (!err) {
      client.db('Demo_CRUD_Project').collection('cities').findOneAndDelete({ "_id": ObjectId(req.params._id) }).then(res.send(`Đã xóa city ${req.body._id}`))
    } else console.log('KHÔNG THỂ KẾT NỐI DATABASE:......' + err);
  })
})

module.exports = router;

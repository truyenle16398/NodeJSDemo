const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  cityName: String,
  cityCode: String,
  shortDescription: String,
  detailDescription: String,
  startCount: {type: Number, min: 0, max: 5},
  reviewCount: Number,
  image: {
    thumnail: String,
    cover: String,
    gallary: [String]
  }
});

module.exports = mongoose.model('City', citySchema);


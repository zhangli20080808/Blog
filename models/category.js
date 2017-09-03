/**
 * Created by liliwa on 17/5/27.
 */
var mongoose = require('mongoose');

var categorySchema = require('../schemas/category');

//创建一个模型 完成一个模型类
module.exports = mongoose.model('Category',categorySchema);


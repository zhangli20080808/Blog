/**
 * Created by liliwa on 17/5/27.
 */

var express = require('express');

var User = require('../models/users');

//router去匹配我们use定义的一些东西
var router = express.Router();

router.use(function (req, res, next) {
    if (!req.userInfo.isAdmin) {
        //如果是非管理员
        res.send('只有管理员才能进入这个页面')
        return;
    }
    next();
});
//首页
router.get('/', function (req, res) {
    res.render('admin/index', {
        userInfo: req.userInfo
    })
});
// 用户管理
router.get('/user', function (req, res) {
    //读取一个模板  从数据库中读取所有用户的数据，然后分配给模板，展示  要用到模型
    User.find().then(function (users) {
        // console.log(users)
        res.render('admin/user_index', {
            userInfo: req.userInfo,
            users: users
        })
    });
});


module.exports = router;
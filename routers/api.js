/**
 * Created by liliwa on 17/5/27.
 */

var express = require('express');

//router去匹配我们use定义的一些东西
var router = express.Router();

//user返回给我们的是一个构造函数，通过一些方法我们可以去操作数据库，通过这个模块，我们不用直接去操作数据库 而是像操作对象一样的去操作数据库
var User = require('../models/users');


//统一返回格式
var responseData;
router.use( function (req,res,next) {
    responseData = {
        //暂时定成两种  1. 返回的错误码，默认为0，代表无错误  2.错误信息,默认为空
        code: 0,
        message: ''
    };
    next();
});

//用户注册   注册逻辑   1.用户名不能为空 2.密码不能为空   3.两次输入密码必须一致 4.用户名是否已经被注册-》数据库查询

router.post('/user/register',function (req,res,next) {
    //如何获取post过来的数据？
    // console.log(req.body)
    // { username: 'zhangli2008', password: '123', repassword: '123' }
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    //用户名不能为空
    if(username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        //如果出错，错误信息是要返回给前台  如何呢  res的一个方法
        res.json(responseData);
        return;
    }
    //密码不能为空
    if(password == ''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    //两次输入的密码必须一致
    if(password != repassword){
        responseData.code = 3;
        responseData.message = '两次输入的密码必须一致';
        res.json(responseData);
        return;
    }
    //用户名是否已经被注册  如果数据库中存在和我们将要注册的数据的用户名同名的数据,表示用户名已经被注册
    //数据库查询  通过模型 我们引入
    User.findOne({
        //第一个参数  查询条件 看数据库中的username和我们注册的是否同名 返回给我们的是一个promise对象
        username: username
    }).then(function (userInfo) {
        // console.log(userInfo)  //null  不存在
        if(userInfo){
            //表示数据中有该记录
            responseData.code = 4;
            responseData.message = '用户名已经被注册'
            res.json(responseData);
            return;
        }
        //否则保存用户存在的信息到数据库中  这个user就代表我们要操作的数据库  直接传入
        var user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then(function (newUserInfo) {
        console.log(newUserInfo);
        responseData.message = '注册成功';
        res.json(responseData);
        return;
    })
});


router.post('/user/login',function (req,res) {

    var username = req.body.username;
    var password = req.body.password;

    //用户名和密码不能为空
    if(username == '' || password == ''){
        responseData.code = 1;
        responseData.message = '用户名和密码不能为空';
        res.json(responseData);
        return;
    }
    //查询数据库中相同用户名和密码的记录是否存在，如果存在，则登录成功
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        // console.log(userInfo);
        if(!userInfo){
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
        responseData.message = '登录成功';
        responseData.userInfo = {
            _id: userInfo.id,
            username: userInfo.username
        };
        //登录成功以后，我们要返回去一个cookies 浏览器得到这个cookies之后，会保存起来
        req.cookies.set('userInfo',JSON.stringify({
                _id: userInfo.id,
                username: userInfo.username
            }
        ));
        res.json(responseData);
        return;
    })

});
//退出
router.get('/user/logout',function (req,res) {
    req.cookies.set('userInfo',null);
    res.json(responseData);
});
module.exports = router;
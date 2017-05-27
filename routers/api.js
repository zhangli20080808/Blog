/**
 * Created by liliwa on 17/5/27.
 */

var express = require('express');

//router去匹配我们use定义的一些东西
var router = express.Router();

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

    responseData.message = '注册成功';
    res.json(responseData)


});

module.exports = router;
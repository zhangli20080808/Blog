/**
 * Created by liliwa on 17/5/27.
 */

var express = require('express');

//router去匹配我们use定义的一些东西
var router = express.Router();

router.use(function (req,res,next) {
    if(!req.userInfo.isAdmin){
        //如果是非管理员
        res.send('只有管理员才能进入这个页面')
        return;
    }
    next();
});

router.get('/',function (req,res) {
    res.render('admin/index',{
        userInfo:req.userInfo
    })
});

module.exports = router;
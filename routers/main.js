/**
 * Created by liliwa on 17/5/27.
 */

var express = require('express');

//router去匹配我们use定义的一些东西
var router = express.Router();

router.get('/',function (req,res) {
    // res.send('aaa')
    //读取  views指定目录下的文件，解析并返回给客户端 第一个参数 表示模板的文件，相对于views目录 找到views/index.html
    //这里还可以接受第二个参数  传递给模板使用的数据
    // res.send('index-users');
    //分配模板使用的数据 我们动态的分配模板  在模板中能使用这个userInfo这个变量了 就是我们页面每次刷新的时候显示的是登录的信息呢，借助模板
    console.log(req.userInfo)
    res.render('main/index',{
        userInfo: req.userInfo
    })
});

module.exports = router;
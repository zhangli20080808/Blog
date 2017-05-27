/**
 * Created by liliwa on 17/5/27.
 * 入口文件
 */


//加载express模块
var express = require('express');
//加载模板引擎
var swig = require('swig');

//创建express应用  类似于nodejs中的http.createServer()
var app  = express();

//设置静态问价托管
//当用户访问的url为 /public时，那么直接返回相对应的 __dirname+'./public' 文件
app.use('./public',express.static(__dirname+'./public'));

//配置模板引擎
//第一个参数，模板引擎的名称，同时也是模板文件的后缀名  第二个参数 表示用于处理解析模板内容文件的方法,也就是用swig.renderFile 解析后缀为html的文件
app.engine('html',swig.renderFile);

//设置模板文件存放的目录  第一个参数必须是views  第二个参数是目录

app.set('views','./views');
//注册模板引擎 第一个参数必须是 view engine 第二个参数和 app.engine 中定义的模板引擎名称（第一个参数）相同
app.set('view engine','html');

//在开发过程中，我们需要取消模板缓存
swig.setDefaults({cache: false});




app.get('/',function (req,res) {
    // res.send('aaa')
    //读取  views指定目录下的文件，解析并返回给客户端 第一个参数 表示模板的文件，相对于views目录 找到views/index.html
    //这里还可以接受第二个参数  传递给模板使用的数据
    res.render('index');
});
//监听http请求
app.listen(8081);
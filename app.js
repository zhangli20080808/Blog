/**
 * Created by liliwa on 17/5/27.
 * 入口文件
 */


//加载express模块
var express = require('express');
//加载模板引擎
var swig = require('swig');
//加载数据库
var mongoose = require('mongoose');
//加载body-paser模块，处理post过来的数据
var bodyParser = require('body-parser');

//创建express应用  类似于nodejs中的http.createServer()
var app  = express();

//设置静态问价托管
//当用户访问的url为 /public时，那么直接返回相对应的 __dirname+'./public' 文件
app.use('/public',express.static(__dirname+'/public'));

//配置模板引擎
//第一个参数，模板引擎的名称，同时也是模板文件的后缀名  第二个参数 表示用于处理解析模板内容文件的方法,也就是用swig.renderFile 解析后缀为html的文件
app.engine('html',swig.renderFile);

//设置模板文件存放的目录  第一个参数必须是views  第二个参数是目录

app.set('views','./views');
//注册模板引擎 第一个参数必须是 view engine 第二个参数和 app.engine 中定义的模板引擎名称（第一个参数）相同
app.set('view engine','html');

//在开发过程中，我们需要取消模板缓存
swig.setDefaults({cache: false});

//body-parser设置  调用这个属性，它自动会在req上面增加一个body属性，也就是提交过来的数据
app.use( bodyParser.urlencoded({extended: true}) );


var admin = require('./routers/admin');
var api = require('./routers/api');
var main = require('./routers/main');

app.use('/admin',admin);
app.use('/api',api);
app.use('/',main);

//监听http请求
mongoose.connect('mongodb://localhost:27018/blog',function (err) {
    if(err){
        console.log('数据库连接失败')
    }else{
        console.log('数据库连接成功');
        app.listen(8081);
    }
});

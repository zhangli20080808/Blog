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
//加载cookies
var Cookies = require('cookies');
var User = require('./models/users');

//创建express应用  类似于nodejs中的http.createServer()
var app = express();

//设置静态问价托管
//当用户访问的url为 /public时，那么直接返回相对应的 __dirname+'./public' 文件
app.use('/public', express.static(__dirname + '/public'));

//设置cookies  无论什么时候用户访问我们的网站，都要走这个中间件
app.use(function (req, res, next) {
    //我们调用req，这个对象将cookies加载到里面
    req.cookies = new Cookies(req, res)
    //给一个任何路由都可以访问的变量

    //解析登录用户的cookies信息
    req.userInfo = {};
    //如果有这个cookies这个信息，我们增加一个userInfo
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            //获取当前用户登录的类型,是否是管理员
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })

        } catch (e) {
            next();
        }
    }else {
        next();
    }
    //然后我们再通过get set方法来设置  刷新页面浏览器会发送一个header过去
    //我们测试一下
    // console.log(req.cookies.get('userInfo'));  //字符串  -》解析下

});
//配置模板引擎
//第一个参数，模板引擎的名称，同时也是模板文件的后缀名  第二个参数 表示用于处理解析模板内容文件的方法,也就是用swig.renderFile 解析后缀为html的文件
app.engine('html', swig.renderFile);

//设置模板文件存放的目录  第一个参数必须是views  第二个参数是目录

app.set('views', './views');
//注册模板引擎 第一个参数必须是 view engine 第二个参数和 app.engine 中定义的模板引擎名称（第一个参数）相同
app.set('view engine', 'html');

//在开发过程中，我们需要取消模板缓存
swig.setDefaults({cache: false});

//body-parser设置  调用这个属性，它自动会在req上面增加一个body属性，也就是提交过来的数据
app.use(bodyParser.urlencoded({extended: true}));


var admin = require('./routers/admin');
var api = require('./routers/api');
var main = require('./routers/main');

app.use('/admin', admin);
app.use('/api', api);
app.use('/', main);

//监听http请求
mongoose.connect('mongodb://localhost:27018/blog', function (err) {
    if (err) {
        console.log('数据库连接失败')
    } else {
        console.log('数据库连接成功');
        app.listen(8081);
    }
});

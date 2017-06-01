### 项目结构
* db    数据库存储目录
* models    数据库模型文件目录
* node_modules 第三方模块
* public 静态资源
* routes 路由
* schemas 数据库结构文件目录
* views 模板视图文件目录
* app.js 入口文件
* package.json



### 应用创建
1. 创建应用 监听端口
2. 用户的访问

### 用户的访问
### 路由的绑定
1. app.get  req res next用于执行下一个和路径匹配的函数

### 内容输出
1. res.send(string)发送内容至客户端

### 模板的配置使用

后端逻辑和表现分离

### 静态文件托管

### 小总结

用户发送http请求->url ->后端解析 -> 找到匹配的规则 -> 执行指定绑定的函数，返回对应的内容

/public->静态 -> 直接读取,返回给诶用户

动态->处理业务逻辑  加载模板解析模板，返回数据给用户

分模块开发

1. 模块划分

 根据功能进行模块划分

 前台模块   后台管理模块  api模块

 使用app.use 进行模块划分

 * app.use('/admin',require('./routes/admin'));
 * app.use('/api',require('./routes/api'));
 * app.use('/',require('./routes/main'));

### 前台路由+模板

#### main 模块
1. /  首页
2. /view  内容页

#### api模块
1. / 首页
2. /register 注册
3. /login  登录
4. /comment  评论
5. /comment/post 评论提交

#### admin 模块
 / 首页

1.用户管理
/user  用户列表

2.分类管理

/category   分类列表

/category/add   分类添加

/category/edit     分类修改

/category/delete    分类删除



2.文章内容管理

/article   文章内容列表

/article/add   文章内容添加

/article/edit     文章内容修改

/article/delete    文章内容删除

2.评论内容管理

/comment   评论列表

/comment/delete   评论删除

### 功能开发顺序

用户 栏目  内容   评论

### 编码顺序

定义数据存储结构

比如  注册登录管理验证 表的结构
功能逻辑

页面展示

### 用户注册

1. 用户表结构设计

    mongoose的连接 根据模型进行我们的add

2. 注册界面


3. 注册逻辑

    * 使用ajax方式实现注册
    * api接口编写

### 用户登录 类似注册

 1. 查询
 2. 普通用户和管理员的区别

    默认为非管理员  我们在入口文件中处理

### 后台管理功能及界面的搭建
1. 界面搭建  模板的复用   继承  有点组件化思想
2. 用户管理模块

### 后台管理 用户注册信息的展示

1. 读取，展示
2. 分页
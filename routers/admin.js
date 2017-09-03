/**
 * Created by liliwa on 17/5/27.
 */

var express = require('express');

var User = require('../models/users');

var Category = require('../models/category');


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
    /*
     * 读取一个模板  从数据库中读取所有用户的数据，然后分配给模板，展示  要用到模型
     * limit(Number) 限制获取的数据条数
     * 比如说 每页两条  共4条  第一页  12   第二页  34  我们可以每次读取两条  第二页 从第三条读起 方法skip
     * skip()  忽略数据的条数
     * 总结 每页显示两条
     * 1: 1-2  skip: 0
     * 2: 3-4  skip: 2
     * 3: 5-6  skip: 4
     * 可以看出来  我们的skip是根据我们的页数来的  （当前页-1）*limit
     * */

    //用户通过http的方式传递一个page过来，有可能不传 默认1
    var page = Number(req.query.page || 1);
    var limit = 2;
    //总页数
    var pages = 0;

    //获取总的条数
    User.count().then(function (count) {
        // console.log(count)

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);

        var skip = (page - 1) * limit;

        User.find().limit(limit).skip(skip).then(function (users) {
            // console.log(users)
            res.render('admin/user_index', {
                userInfo: req.userInfo,
                users: users,

                page: page,
                count: count,
                pages: pages,
                limit: limit
            })
        });
    });


});

//分类首页    以get方式访问我们返回一个页面
/*
 * 分类首页
 * */
router.get('/category', function(req, res) {

    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Category.count().then(function(count) {

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min( page, pages );
        //取值不能小于1
        page = Math.max( page, 1 );

        var skip = (page - 1) * limit;

        /*
         * 1: 升序
         * -1: 降序
         * */
        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function(categories) {
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,

                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });

    });

});

//分类的添加
router.get('/category/add', function (req, res) {
    res.render('admin/category_add.html', {
        userInfo: req.userInfo
    })
});
//分类的保存
router.post('/category/add', function (req, res) {
    // console.log(req.body)  如果用户提交的一些信息 不符合我们的规则，我们是要返回一个跳转页面的

    var name = req.body.name || '';
    if (name == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '名称不能为空啊'
        })
        return;
    }
    //数据库中是否已经存在同名分类名称
    Category.findOne({
        name: name
    }).then(function(rs) {
        if (rs) {
            //数据库中已经存在该分类了
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类已经存在了'
            });
            return Promise.reject();
        } else {
            //数据库中不存在该分类，可以保存
            return new Category({
                name: name
            }).save();
        }
    }).then(function(newCategory) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '分类保存成功',
            url: '/admin/category'
        });
    })

});


/*
 * 分类修改
 * */
router.get('/category/edit', function(req, res) {

    //获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id || '';

    //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        }
    })

});


/*
 * 分类的修改保存
 * */
router.post('/category/edit', function(req, res) {

    //获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id || '';
    //获取post提交过来的名称
    var name = req.body.name || '';

    //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        } else {
            //当用户没有做任何的修改提交的时候
            if (name == category.name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                });
                return Promise.reject();
            } else {
                //要修改的分类名称是否已经在数据库中存在
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                });
            }
        }
    }).then(function(sameCategory) {
        if (sameCategory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '数据库中已经存在同名分类'
            });
            return Promise.reject();
        } else {
            return Category.update({
                _id: id
            }, {
                name: name
            });
        }
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        });
    })

});

/*
 * 分类删除
 * */
router.get('/category/delete', function(req, res) {

    //获取要删除的分类的id
    var id = req.query.id || '';

    Category.remove({
        _id: id
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        });
    });

});

module.exports = router;

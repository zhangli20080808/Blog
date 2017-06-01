$(function() {

    var $loginBox = $('#loginBox');
    var $registerBox = $('#registerBox');
    var $userInfo = $('#userInfo');

    //切换到注册面板
    $loginBox.find('a.colMint').on('click', function() {
        $registerBox.show();
        $loginBox.hide();
    });

    //切换到登录面板
    $registerBox.find('a.colMint').on('click', function() {
        $loginBox.show();
        $registerBox.hide();
    });

    //注册
    $registerBox.find('button').on('click',function () {
        //通过ajax的方式去提交
        $.ajax({
            type : 'post',
            url:'/api/user/register',
            data: {
              username:$registerBox.find('[name=username]').val(),
              password:$registerBox.find('[name=password]').val(),
              repassword:$registerBox.find('[name=repassword]').val()
            },
            dataType: 'json',
            success:function (result) {
                // console.log(result)
                $registerBox.find('.colWarning').html(result.message);
                if(!result.code){
                    setTimeout(function () {
                        $loginBox.show();
                        $registerBox.hide();
                    },1000)
                }
            }
        })
    });

    //登录
    $loginBox.find('button').on('click',function () {
        // 通过ajax的方式去提交
        $.ajax({
            type: 'post',
            url: 'api/user/login',
            data:{
                username:$loginBox.find('[name=username]').val(),
                password:$loginBox.find('[name=password]').val()
            },
            dataType: 'json',
            success: function (result) {
                // console.log(result)
                $loginBox.find('.colWarning').html(result.message);

                if(!result.code){
                    //登录成功直接刷新页面
                    window.location.reload();
                }
            }

        })
    })

    //退出

});
$(function(){
    var $loginBox=$("#loginBox");
    var $resBox=$("#registerBox");
    var $userBox=$("#userInfo");


    $loginBox.find("a.colMint").on("click",function(){
        $loginBox.hide();
        $resBox.show();
    });

    $resBox.find("a.colMint").on("click",function(){
        $resBox.hide();
        $loginBox.show();
    });


//注册
    $resBox.find('button').on('click',function(){
        var uname=$resBox.find('[name="username"]').val();
        var pwd=$resBox.find('[name="password"]').val();
        var repwd=$resBox.find('[name="repassword"]').val();
        if(uname=="" || pwd=="" || uname==null || pwd==null){
            alert("用户名或者密码不能为空");
            return;
        }
        if(pwd!=repwd){
            alert("两次输入的密码不一致");
            return;
        }
        //通过ajax发送请求
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:$resBox.find('[name="username"]').val(),
                password:$resBox.find('[name="password"]').val()
            },
            dataType:"json",
            success:function(result){
                $resBox.find('.colWarning').html(result.message);

                if(result.code==2){
                    //注册成功
                    setInterval(function(){
                        $loginBox.show();
                        $resBox.hide();
                    },1000)
                }

            }

        })
    });










//用户登录
    $loginBox.find('button').on('click',function(){
        var uname=$loginBox.find('[name="username"]').val();
        var pwd=$loginBox.find('[name="password"]').val();
        if(uname=="" || pwd=="" || uname==null || pwd==null){
            alert("用户名或者密码不能为空");
            return;
        }
        //通过ajax发送请求
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$loginBox.find('[name="username"]').val(),
                password:$loginBox.find('[name="password"]').val()
             },
            dataType:"json",
            success:function(result){
                $resBox.find('.colWarning').html(result.message);
                console.log(result);
                if(result.code==2) {
                   /* //登录成功

                    $userBox.show();
                    $loginBox.hide();
                    //判断是管理员还是普通用户
                    if (result.info.isAdmin == 0) {   //普通用户
                        $userBox.find("p.userName span").html(result.info.uname)
                        $userBox.find("p.adminInfo").hide();
                    } else if (result.info.isAdmin == 1) {
                        $userBox.find("p.userName span").html(result.info.uname)
                        $userBox.find("p.adminInfo").show();
                    }*/
                    window.location.reload();
                }
            }
        })
    })

//退出
$("#logout").on('click',function(){

    $.ajax({
        type:"get",
        data:null,
        url:"/api/user/login",
        dataType:'json',
        success:function(data){
            if(data=="1"){
                window.location.href="http://127.0.0.1/api/user/login";
                window.location.reload();
                alert("退出成功");
            }


        }

    });
});







//评论的提交请求
    $("#messageBtn").on("click",function(){
        var comText=$("#messageContent").val();
        var cid=$("#contentId").val();
        //console.log(cid);
       $.ajax({
           type:"post",
           url:"/view/comments",
           data:{
               content:comText,
               cid:cid

           },
           dataType:'json',
           success:function(data){
               if(data=="1"){
                   alert("评论成功");
                    window.location.reload();
                   var comText=$("#messageContent").val("");
               }else {
                   alert("网络问题，评论失败");
               }

           }

       });
    });








});
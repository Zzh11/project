/**
 * Created by LENOVO on 2018/8/23.
 */
$(function(){
    $("#loginpages input").focus(function(){
        $(this).css("border-color","#c1e2be");
    });
});

//注册的时候，用户名失去焦点验证
function checkInfos(obj,tabname,colname){
    //先得到用户名
    var info=obj.value;
    //现在就应该发送请求给服务器，判断这个用户名是否存在
    $.get("checkUserName",{uname:info},function(data){
        //现在，请求已经发了，现在转移战场，转到服务器端
        if(data=="0"){
            $(obj).next().eq(0).text("用户名不能为空").css("color","red");
        }else if(data=="1"){
            $(obj).next().eq(0).text("该用户名已经存在").css("color","red");
        }else if(data=="2") {
            $(obj).next().eq(0).text("用户名验证成功").css("color", "lime");
        }
    });
}

//用户注册
function userzc(){
    //先得到值
    var uname=$("#zcuname").val();
    var pwd=$("#zcpwd").val();
    var repwd=$("#zcpwdagain").val();

    //首先，判断值是否正确，密码长度不小于6位，并且， 重复密码要相等
    if(pwd.length<6 ||pwd!=repwd){
        alert("条件不满足");
        console.log(pwd);
        console.log(repwd);
    }else {
        $.post("userRegister",{uname:uname,pwd:pwd},function(data){
            if(data=="0"){
                alert("注册失败，网络问题，绝对是");
            }else if(data=="1"){
                //注册成功
                hidenzcpage();
                showLogin();
            }
        });
    }
}
function userlogin(){
    //首先得到数据
    var uname=$("#uname").val();
    var pwd=$("#pwd").val();
    if(uname=="" || pwd=="" || uname==null || pwd==null){
        alert("用户名或者密码不能为空");
        return;
    }
    //发请求

    $.post("userlogin",{uname:uname,pwd:pwd},function(data){
        if(data=="0") {
            alert("用户名或密码错误，请验证后重新登录");
        }else if(data=="1") {
            //因此登录框关闭
            hidenloginpage();
            var str = '尊敬的VIP<a href="">[' + uname + ']</a>您好，&nbsp;&nbsp;&nbsp;&nbsp;' +
                '<a href="javascript:userOutLogin()">注销</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="./back/goods.html">后台管理</a>';
            $("header").html(str);

        }
    })
}




//打开登录窗口
function showLogin(){

    $("#uname").val("");
    $("#pwd").val("");
    $("#loginpages").mywin({left:"center",top:"center"});
    $("#zcpages").hide();
    $(".bg").fadeIn("200","linear");
}

//关闭层
function hidenloginpage(){
    $("#loginpages").hide();
    $(".bg").fadeOut();
}

//打开注册窗口
function showRegister(){
    $("#zcuname").val("");
    $("#zcpwd").val("");
    $("#zcpwdagain").val("");
    $("#zcpages").mywin({left:"center",top:"center"});
    $("#loginpages").hide();
    $(".bg").fadeIn("200","linear");
    $("#registertishi").html("");
}

//关闭注册窗口
function hidenzcpage(){
    $("#zcpages").hide();
    $(".bg").fadeOut();
}


//在线客服事件

function showcustomerservice(){
    if($('#showli').css('display')=='none'){
        $('#showli').css('display','block');
    }else {
        return;
    }
}

function hidecustomerservice(){
    if($('#showli').css('display')=='block'){
        $('#showli').css('display','none');
    }else {
        return;
    }
}
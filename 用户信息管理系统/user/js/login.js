/**
 * Created by LENOVO on 2018/8/30.
 */
function userLogin(){
    var uname = $("#uname").val();
    var pwd = $("#pwd").val();
    //console.log(uname);
    if(uname=="" || pwd=="" || uname==null || pwd==null){
        alert("用户名或者密码不能为空");
        return;
    }

    $.ajax({
        type:'post',
        url:'/login',
        data:{
            uname:$("#uname").val(),
             pwd:$("#pwd").val()
        },
        dataType:"json",
        success:function(data){
            if(data=="0"){
               $("#resultInfo").html("登录失败");
            }else if(data=="1"){
                $("#resultInfo").html("登录成功");
                $("#uname").val("");
                $("#pwd").val("");
              setTimeout(function(){
                  location.href='http://127.0.0.1:8888/show';
              },1500)
            }

        }
    });


}
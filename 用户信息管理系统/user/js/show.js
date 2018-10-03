/**
 * Created by LENOVO on 2018/8/30.
 */
$.ajax({
   type:'post',
    url:'/show',
    success:function(result){
        var str="";
        $.each(result,function(index,item){
             str+='<tr><td>'+item.usid+'</td>' +
                  '<td>'+item.uname+'</td>' +
                  '<td>'+item.pwd+'</td>' +
                  '<td><img id="showImg" src="../photo'+item.photo.split("photo")[1]+'"/></td>/tr>';
        });
        $("#userInfo").html(str);
    }
});
/**
 * Created by LENOVO on 2018/8/30.
 */
function addUser(){
    //先得到值
    var uname = $("#uname").val();
    var pwd = $("#pwd").val();

    //文件上传的ajax请求
    $.ajaxFileUpload({
        url:'/addUser',
        fileElementId:"photo",
        data:{uname:uname,pwd:pwd},
        dataType:"json",
        success:function(data){    //当请求成功的时候，回调的函数
            if(data=="1"){
                alert("账号注册成功");
                $("#uname").val("");
                $("#pwd").val("");
                $("#photo").val("");
            }else {
                console.log(data);
                alert("账号已存在，注册失败");
            }
        },
        error:function(data,status,e){
                //当请求失败的时候，回调的函数
                console.log(e);
        }
    });
};
//定义一个文件读取的类
var fileReader=new FileReader();
function previewMultipleImage(){
    var inp=document.getElementById("photo");
    //获取所有的数据，默认返回一个数组
    var fileList=inp.files;
    //读取图片，返回的类型值是dataUrl
    fileReader.readAsDataURL(fileList[0]);

}
//注意，读取文件是需要时间的，我们得保证文件读取完毕之后再显示
fileReader.onload=function(event) {     //结果集
    $("#news_pic_show").append('<img id="pic_show"/>');
    document.getElementById("pic_show").src=event.target.result;
    console.log(event.target.result);
}
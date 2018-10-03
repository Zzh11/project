/**
 * Created by LENOVO on 2018/8/25.
 */
//首先网页加载，显示数据类型
$(function(){
    $.get("/getAllTypes",null,function(data){
        if(!data.err){
            $.each(data,function(index,item){
                $("#tid").append($("<option value='"+item.tid+"'>"+item.tname+"</option>") );
            })
        }
    },"json");
});

//添加商品
function addGoods(){
    //首先得到数据
    var tid=$("#tid").val();
    var pname=$("#pname").val();
    var price=$("#price").val();

    //文件上传的ajax请求
    $.ajaxFileUpload({
        url:'/addGoods',
        fileElementId:"pic",
        data:{tid:tid,pname:pname,price:price},
        dataType:"json",
        success:function(data){    //当请求成功的时候，回调的函数
            if(data=="1"){
                alert("商品信息添加成功");
                $("#tid").val("");
                $("#pname").val("");
                $("#price").val("");
                $("#pic").val("");
                $("#showpic").val("");
            }else {
                alert("商品信息添加失败");
            }
        },
        error:function(data,status,e){     //当请求失败的时候，回调的函数
            console.log(e);
        }
    });
}

function showGoodsInfo(){
    $.post("/getAllGoodsInfo",null,function(data){
        if(data.err=="0"){
            alert("暂无数据");
        }else {
            var str="";
            $.each(data,function(index,item){
                str+='<tr><td><img id="showImg" src="../pic'+item.pic.split("pic")[1]+'"/></td>' +
                    '<td>'+item.gid+'</td>' +
                    '<td>'+item.gname+'</td>' +
                    '<td>'+item.price+'</td>' +
                    '<td>'+item.tname+'</td>/tr>';
            });
            $("#showGoodsInfo").html(str);
        }
    },"json");
}

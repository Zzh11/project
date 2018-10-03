//1，引入模块
var express=require("express");
var mysql=require("mysql");
var bodyparser=require("body-parser");
var fs=require("fs");
var multer=require("multer");

var app=express();
//配置信息
//为bodyparser来配置
app.use(bodyparser.urlencoded({extended:false}));
//为multer来配置
var upload=multer({dest:"./page/pic"});
//配置数据库连接池
var pool=mysql.createPool({
    host:"127.0.0.1",
    port:3306,
    database:"goods",
    user:"root",
    password:"a"
});
//开始监听请求
app.get("/checkUserName",function(req,res){
    var uname=req.query.uname;
    if(uname==""){
        res.send("0");
    }else {
        //查数据库
        pool.getConnection(function(err,conn){
            conn.query("select * from admininfo where aname=?",[uname],function(err,result){
                //一定要释放连接
                conn.release();
                if(result.length>0){
                    res.send("1");
                }else {
                    res.send("2");
                }
            })
        })

    }

});

//用户注册账号
app.post("/userRegister",function(req,res){


    pool.getConnection(function(err,conn){
        conn.query("insert into adminInfo values(0,?,?,?)",[null,req.body.uname,req.body.pwd,],function(err,result){
            conn.release();
            if(err){
                console.log(err);
                res.send("0"); //0代表错误
            }else {
                res.send("1");
            }


        });
    });
});

//监听用户登录
app.post("/userLogin",function(req,res){

    pool.getConnection(function(err,conn){
        conn.query("select * from adminInfo where aname=? and pwd=?",[req.body.uname,req.body.pwd],function(err,result){
            conn.release();
            if(err || result.length<=0){
                console.log(err);
                res.send("0"); //0代表登录失败
            }else {
                res.send("1");
            }
        });
    })
});



//添加商品类型
app.post("/addGoodsType", function (req,res){
    pool.getConnection(function(err,conn){
        if(err){
            console.log(err);
        }else {
            conn.query("insert into goodsType values(0,?,1)",[req.body.tname],function(err,result){
                conn.release();
                if(err){
                    res.send("-1");
                }else {
                    res.send(result.insertId + "");
                }
            });
        }
    });
});

//获取所有的商品
app.get("/getAllTypes", function (req,res){
    pool.getConnection(function(err,conn){
        if(err){
            console.log(err);
        }else {
            conn.query("select * from goodsType where status=1",function(err,result){
                conn.release();
                //这里规定，传输的数据类型是json类型的
                res.header("Content-Type","application/json");
                if(result.length>0){
                    res.send(result);
                }else {
                    res.send('{"err":"0"}');
                }
            });
        }
    })
});


//删除商品
app.post("/delGoodsType",function(req,res){
    pool.getConnection(function(err,conn){
        if(err){
            console.log(err);
        }else {
            conn.query("update goodsType set status=0 where tid=?",[req.body.tid],function(err,result) {
                conn.release();
                //这里规定，传输的数据类型是json类型的

                if (err) {
                    res.send("-1");
                } else {
                    res.send("1");
                }
            });
        }
    })
});


//添加商品
app.post("/addGoods",upload.array("pic"),function(req,res){
    pool.getConnection(function(err,conn){
        if(err){
            console.log(err);
        }else {
            //先处理一下图片路径
            var fileName="";
            var filePath="";
            var file;
            for(var i=0;i<req.files.length;i++){
                //得到文件
                file=req.files[i];
                //为了图片名字不重名，改为日期格式
                        //var d=new Date();   d.getTime();
                fileName=new Date().getTime() + "_" +file.originalname;          //11324345556_xxx.jpg
                //重命名
                fs.renameSync(file.path,__dirname +"/page/pic/"+fileName );
                //累加名字
                filePath+="/page/pic/"+fileName;
                console.log(fileName);
            }
            conn.query("insert into goodsInfo values(0,?,?,?,?)",[req.body.pname,req.body.price,filePath,req.body.tid],function(err,result){
                conn.release();
                //这里的send，和ajax里的data一一对应就可以
                if(err){
                    console.log(err);
                    res.send("-1");
                }else {
                    res.send("1");
                }
            });
        }
    });
});

//获取所有商品信息的请求
app.post("/getAllGoodsInfo",function(req,res){
    pool.getConnection(function(err,conn){
        res.header("Content-Type","application/json");
        if(err){
            console.log(err);
        }else {
            conn.query("select g.*,t.tname from goodsInfo g,goodsType t where g.tid=t.tid",function(err,result){
                conn.release();
                if(result.length<=0){
                    res.send("{'err':'0'}");
                }
                res.send(result);
            });
        }
    });
});






app.use(express.static("page"));


app.listen(8888,function(err){
    if(err){
        console.log(err);
    }else{
        console.log("服务器开启成功");
    }
});




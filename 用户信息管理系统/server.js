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
var upload=multer({dest:"./user/photo"});
//配置数据库连接池
var pool=mysql.createPool({
    host:"127.0.0.1",
    port:3306,
    database:"user",
    user:"root",
    password:"a"
});

app.use(express.static("user"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"./user/index.html")
});

app.get("/login",function(req,res){

    res.sendFile(__dirname+"/user/login.html")
});
app.get("/show",function(req,res){

    res.sendFile(__dirname+"/user/back/show.html")
});
//用户注册
app.post("/addUser",upload.array("photo"),function(req,res){
    var uname=req.body.uname;
    var pwd=req.body.pwd;
    if(uname=="" ||pwd=="" || uname==null|| pwd==null){
        alert("账号密码不能为空，请重新输入");
    }
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
                fs.renameSync(file.path,__dirname +"/user/photo/"+fileName );
                //累加名字
                filePath+="/user/photo/"+fileName;
                //console.log(fileName);
            }
            conn.query("insert into userInfo values(0,?,?,?)",[uname,pwd,filePath],function(err,result){
                conn.release();
                if(err){
                    console.log(err);
                    res.send("-1");
                }else {
                    res.send("1");

                }
            })
        }

    });
});


//用户登录
    app.post("/login",function(req,res){
        var uname=req.body.uname;
        var pwd=req.body.pwd;
        pool.getConnection(function(err,conn) {
            if(err){
                console.log(err);
            }else {
                conn.query("select * from userInfo where uname = ? and pwd = ?", [uname, pwd],function(err,result){
                    conn.release();
                    if (err) {
                        console.log(err);
                    }else if(result.length<=0){
                        res.send("0");
                    }else {
                        res.send("1");
                    }
                });
            }
         })
    });


//show
app.post("/show",function(req,res){
    pool.getConnection(function(err,conn) {
        if(err){
            console.log(err)
        }else {
            conn.query("select * from userInfo",function(err,result){
                conn.release();
                if(err){
                    console.log(err);
                }else {
                    res.json(result);
                    console.log(result.usid);
                }
            });
        }
    })
});








app.listen(8888,"127.0.0.1",function(err){
    if(err){
        console.log(err);
    }else{
        console.log("服务器开启成功");
    }
});

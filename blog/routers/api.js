/**
 * Created by LENOVO on 2018/8/27.
 */

//路由操作
var express=require("express");
var mysql=require("mysql");


//配置数据连接池
var pool=mysql.createPool({
    host:'127.0.0.1',
    port:3306,
    database:'blog',
    user:'root',
    password:'a'
});


//第一步需要加载路由
var router=express.Router();

//第二步，处理请求
//统一返回格式
var resData;
router.use(function(req,res,next){
    resData={
        code:-1,
        message:""
    };
    next();
});

//注册
router.post("/user/register",function(req,res,next){
    var uname=req.body.username;
    var pwd=req.body.password;
    pool.getConnection(function(err,conn){
        if(err){
            resData.code=0;
            resData.message="网络连接失败，请稍后重试";
            res.json(resData);   //服务器端要求返回json，因此我们返回json数据格式
        }else{
            conn.query("select * from user where uname=?",[uname],function(err,result){
                if(err){
                    resData.code=0;
                    resData.message="网络连接失败，请稍后重试";
                    res.json(resData);
                }else if(result.length>0){
                    resData.code=1;
                    resData.message="该用户已经注册过了";
                    res.json(resData);
                }else {
                    //说明没有注册过
                    conn.query("insert into user values(null,?,?,0)",[uname,pwd],function(err,result){
                        conn.release();
                        if(err){
                            resData.code=0;
                            resData.message="网络连接失败，请稍后重试";
                            res.json(resData);
                        }else {
                            resData.code=2;
                            resData.message="注册成功";
                            res.json(resData);

                        }
                    });
                }
            });
        }
    });
});

//登录
router.post("/user/login",function(req,res,next){
    var uname=req.body.username;
    var pwd=req.body.password;
    pool.getConnection(function(err,conn) {
        if (err) {
            resData.code=0;
            resData.message = "网络连接失败，请稍后重试";
            res.json(resData);
        } else {
            conn.query("select * from user where uname = ? and pwd = ?", [uname, pwd], function (err, result) {
                conn.release();
                if (err) {
                    resData.code=0;
                    resData.message = "网络连接失败，请稍后重试";
                    res.json(resData);
                }else if(result.length<=0) {
                    resData.code=1;
                    resData.message = "用户密码错误，请验证后再试";
                    res.json(resData);
                } else {
                    resData.code=2;
                    resData.message = "登陆成功";
                    resData.info=result[0];

                    //将登陆的用户存到result里面去,   不能写在 res.json(resData);的后面
                    req.session.userInfo=result[0];
                    //console.log(result);
                    //console.log(result[0]);

                    res.json(resData);
                }
            })
        }
    });
});

//前台退出登录
router.get("/user/login",function(req,res){
    req.session.userInfo=null;
    req.session.cookie.originalMaxAge=0;

    //console.log(req.session);
    res.send("1");

});









            /*router.get("/",function(req,res){
                res.sendfile("../view/api/index.html");
            });*/

//第三步将这个支线模块，加载到主模块里面去
module.exports=router;
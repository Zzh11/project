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

//当加载main。JS的时候，我们就必定是首页里的内容，而首页里的内容，绝对要有分类
var alltype;
router.use(function(req,res,next){
    pool.getConnection(function(err,conn){
        conn.query("select * from type order by tid",function(err,result){
            conn.release();
            alltype=result;
            //注意一定要执行next
            next();   //next()指继续往下执行，让程序查完sql语句之后，继续往下运行
        })
    })
});

//第二步，处理请求
router.get("/",function(req,res){
    //console.log(req.query);
    //如果req.query.page有值，则为req.query.page，否则为1
    var page=Number(  req.query.page || 1);     //当前页数，默认为1，，1代表首页
    var mytype=Number(  req.query.mytype || 1);    //当前类型，默认为1，，1代表首页


    pool.getConnection(function(err,conn){

            //注意，我们这里需要同时查；两个东西   1，所有的文章类型   2，所有的文章内容
            //请注意，绝对不能在释放链接之后再去查找
            //这里不能重名
            if(mytype==1){
                var sql1="select c.*,t.tname,u.uname from contents c,type t,user u where c.tid=t.tid and c.uid=u.uid";
            }else {
                var sql1="select c.*,t.tname,u.uname from contents c,type t,user u where c.tid=t.tid and c.uid=u.uid and c.tid="+mytype;
            }

            conn.query(sql1,function(err2,result2){

                //总记录条数
                var count=result2.length;

                //一次显示多少条数据
                var size=6;

                //计算总页数
                var pages=Math.ceil(count/size);

                //要控制一下页数
                page=Math.min(page,pages);
                page=Math.max(page,1);

                //开始的条数
                 var beginSize=(page-1)*size;
                //开始分页查找
                if(mytype==1){
                    var sql2="select c.*,t.tname,u.uname from contents c,type t,user u where c.tid=t.tid and c.uid=u.uid limit ?,?";
                }else {
                    var sql2="select c.*,t.tname,u.uname from contents c,type t,user u where c.tid=t.tid and c.uid=u.uid and c.tid="+mytype+" limit ?,?";
                }
                conn.query(sql2,[beginSize,size],function(err2,result2){
                        conn.release();
                        res.render("main/index",{
                            types:alltype,
                            contents:result2,
                            page:page,
                            pages:pages,
                            size:size,
                            count:count,
                            mytype:mytype,
                            userInfo:req.session.userInfo   //取session
                        });
                 })
            })

    });



    //res.sendfile("../view/main/index.html");
});


//查看文章详情

router.get("/view",function(req,res){
    var views=req.query.views;
    var cid=req.query.cid;
    var mytype=Number(req.query.mytype || 1);
    pool.getConnection(function(err,conn){
        conn.query("select c.*,u.uname from contents c,user u where c.uid=u.uid and c.cid=?",
            [cid],function(err,result){
                conn.query("update contents set views=? where cid=?",
                    [views,cid],function(err,result2){
                        conn.release();
                        if(err){
                            console.log(err);
                        }else {
                            res.render("main/view",{
                                types:alltype,
                                mytype:mytype,

                                content:result[0],

                                userInfo:req.session.userInfo
                            });

                        }
                    });

        });
    });
});



//评论的提交
    var uid;
router.post("/view/comments",function(req,res){
    var content=req.body.content;
    var cid=req.body.cid;

    console.log(cid);
    var userInfo=req.session.userInfo;
    var uid=String(userInfo.uid);
    //console.log(typeof (uid));
    //console.log(typeof (cid));
    var date=new Date();
    var ctime=date.getFullYear() +"年"+ (date.getMonth()+1) +"月"+ date.getDate() +" "+ date.getHours()
        +":"+date.getMinutes() +":"+ date.getSeconds() +":"+ date.getMilliseconds();
    pool.getConnection(function(err,conn){
        if(err){
            console.log(err);
        }
        conn.query("insert into comments values(0,?,?,?,?)",
            [uid,cid,ctime,content],function(err,result){
                conn.query("update contents set comment=(select count(comid) from comments where cid=?) where cid=?",
                    [cid,cid],function(err,result1){
                                conn.release();
                                if(err){
                                    console.log(err);
                                    res.send("0");
                                }else if(result.affectedRows >0){
                                    if(result1.affectedRows >0){
                                        // console.log(result1);
                                        res.send("1");
                                    }else {
                                        console.log(err);
                                        res.send("0");
                                    }
                                }
                  });
        });
    });
});






//第三步将这个支线模块，加载到主模块里面去
module.exports=router;
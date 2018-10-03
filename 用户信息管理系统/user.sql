create table userInfo(
	usid int primary key auto_increment,
	uname varchar(100) not null  unique,
	pwd varchar(20) not null,
	photo varchar(200)
);
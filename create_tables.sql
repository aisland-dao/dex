drop table tokens;
create table tokens(
    id int(11) auto_increment,
    symbol varchar(32) not null,
    name varchar(128) not null,
    decimals int not null,
    platform varchar(32) default '',
    address varchar(128) default '',
    logouri varchar(128) default '',
    ranking int(11) default 0 
    originallogouri varchar(512) default '',
    dtupdate datetime not null,
    PRIMARY KEY (id)
);

-- contact table creation
create table contact (
  id int not null auto_increment,
  contactName text not null,
  contactEmail text not null,
  aptDate date not null default '1970-01-01',
  reason text,
  cash text not null,
  primary key(id)
);

-- sale table creation
-- PLEASE NOTE: there is a table called "sales" and a table called "sale". "sales" is from an in-class example and SHOULD NOT be looked at when grading hw6
create table sale (
  id int not null auto_increment,
  saleText text not null,
  timeCreated timestamp not null default CURRENT_TIMESTAMP,
  timeEnded timestamp default null,
  primary key(id)
);

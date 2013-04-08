# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table account (
  uid                       varchar(255) not null,
  email                     varchar(255),
  name                      varchar(255),
  password                  varchar(255),
  constraint pk_account primary key (uid))
;

create table colorbar (
  uid                       varchar(255) not null,
  name                      varchar(255),
  is_public                 boolean,
  account_uid               varchar(255),
  constraint pk_colorbar primary key (uid))
;

create table dataset (
  uid                       varchar(255) not null,
  name                      varchar(255),
  separator                 varchar(255),
  size                      bigint,
  upload_time               bigint,
  account_uid               varchar(255),
  constraint pk_dataset primary key (uid))
;

create table export (
  uid                       varchar(255) not null,
  name                      varchar(255),
  creation_time             bigint,
  map_uid                   varchar(255),
  constraint pk_export primary key (uid))
;

create table font (
  uid                       varchar(255) not null,
  name                      varchar(255),
  is_public                 boolean,
  account_uid               varchar(255),
  constraint pk_font primary key (uid))
;

create table icon (
  uid                       varchar(255) not null,
  name                      varchar(255),
  is_public                 boolean,
  account_uid               varchar(255),
  constraint pk_icon primary key (uid))
;

create table map (
  uid                       varchar(255) not null,
  name                      varchar(255),
  creation_time             bigint,
  last_modified_time        bigint,
  account_uid               varchar(255),
  constraint pk_map primary key (uid))
;

create table raster (
  uid                       varchar(255) not null,
  name                      varchar(255),
  creation_time             bigint,
  dataset_uid               varchar(255),
  constraint pk_raster primary key (uid))
;

create table style (
  uid                       varchar(255) not null,
  name                      varchar(255),
  is_public                 boolean,
  account_uid               varchar(255),
  constraint pk_style primary key (uid))
;

create sequence account_seq;

create sequence colorbar_seq;

create sequence dataset_seq;

create sequence export_seq;

create sequence font_seq;

create sequence icon_seq;

create sequence map_seq;

create sequence raster_seq;

create sequence style_seq;

alter table colorbar add constraint fk_colorbar_account_1 foreign key (account_uid) references account (uid);
create index ix_colorbar_account_1 on colorbar (account_uid);
alter table dataset add constraint fk_dataset_account_2 foreign key (account_uid) references account (uid);
create index ix_dataset_account_2 on dataset (account_uid);
alter table export add constraint fk_export_map_3 foreign key (map_uid) references map (uid);
create index ix_export_map_3 on export (map_uid);
alter table font add constraint fk_font_account_4 foreign key (account_uid) references account (uid);
create index ix_font_account_4 on font (account_uid);
alter table icon add constraint fk_icon_account_5 foreign key (account_uid) references account (uid);
create index ix_icon_account_5 on icon (account_uid);
alter table map add constraint fk_map_account_6 foreign key (account_uid) references account (uid);
create index ix_map_account_6 on map (account_uid);
alter table raster add constraint fk_raster_dataset_7 foreign key (dataset_uid) references dataset (uid);
create index ix_raster_dataset_7 on raster (dataset_uid);
alter table style add constraint fk_style_account_8 foreign key (account_uid) references account (uid);
create index ix_style_account_8 on style (account_uid);



# --- !Downs

drop table if exists account cascade;

drop table if exists colorbar cascade;

drop table if exists dataset cascade;

drop table if exists export cascade;

drop table if exists font cascade;

drop table if exists icon cascade;

drop table if exists map cascade;

drop table if exists raster cascade;

drop table if exists style cascade;

drop sequence if exists account_seq;

drop sequence if exists colorbar_seq;

drop sequence if exists dataset_seq;

drop sequence if exists export_seq;

drop sequence if exists font_seq;

drop sequence if exists icon_seq;

drop sequence if exists map_seq;

drop sequence if exists raster_seq;

drop sequence if exists style_seq;


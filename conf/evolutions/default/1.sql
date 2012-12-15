# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table account (
  account_uid               varchar(255) not null,
  email                     varchar(255),
  name                      varchar(255),
  password                  varchar(255),
  constraint pk_account primary key (account_uid))
;

create table color_bar (
  color_bar_uid             varchar(255) not null,
  name                      varchar(255),
  is_public                 boolean,
  account_account_uid       varchar(255),
  constraint pk_color_bar primary key (color_bar_uid))
;

create table dataset (
  dataset_uid               varchar(255) not null,
  name                      varchar(255),
  size                      bigint,
  upload_time               bigint,
  account_account_uid       varchar(255),
  constraint pk_dataset primary key (dataset_uid))
;

create table font (
  font_uid                  varchar(255) not null,
  name                      varchar(255),
  is_public                 boolean,
  account_account_uid       varchar(255),
  constraint pk_font primary key (font_uid))
;

create table icon (
  icon_uid                  varchar(255) not null,
  name                      varchar(255),
  is_public                 boolean,
  account_account_uid       varchar(255),
  constraint pk_icon primary key (icon_uid))
;

create table map (
  map_uid                   varchar(255) not null,
  name                      varchar(255),
  style_style_uid           varchar(255),
  colorbar_color_bar_uid    varchar(255),
  dataset_dataset_uid       varchar(255),
  account_account_uid       varchar(255),
  constraint pk_map primary key (map_uid))
;

create table style (
  style_uid                 varchar(255) not null,
  name                      varchar(255),
  is_public                 boolean,
  account_account_uid       varchar(255),
  constraint pk_style primary key (style_uid))
;

create sequence account_seq;

create sequence color_bar_seq;

create sequence dataset_seq;

create sequence font_seq;

create sequence icon_seq;

create sequence map_seq;

create sequence style_seq;

alter table color_bar add constraint fk_color_bar_account_1 foreign key (account_account_uid) references account (account_uid);
create index ix_color_bar_account_1 on color_bar (account_account_uid);
alter table dataset add constraint fk_dataset_account_2 foreign key (account_account_uid) references account (account_uid);
create index ix_dataset_account_2 on dataset (account_account_uid);
alter table font add constraint fk_font_account_3 foreign key (account_account_uid) references account (account_uid);
create index ix_font_account_3 on font (account_account_uid);
alter table icon add constraint fk_icon_account_4 foreign key (account_account_uid) references account (account_uid);
create index ix_icon_account_4 on icon (account_account_uid);
alter table map add constraint fk_map_style_5 foreign key (style_style_uid) references style (style_uid);
create index ix_map_style_5 on map (style_style_uid);
alter table map add constraint fk_map_colorbar_6 foreign key (colorbar_color_bar_uid) references color_bar (color_bar_uid);
create index ix_map_colorbar_6 on map (colorbar_color_bar_uid);
alter table map add constraint fk_map_dataset_7 foreign key (dataset_dataset_uid) references dataset (dataset_uid);
create index ix_map_dataset_7 on map (dataset_dataset_uid);
alter table map add constraint fk_map_account_8 foreign key (account_account_uid) references account (account_uid);
create index ix_map_account_8 on map (account_account_uid);
alter table style add constraint fk_style_account_9 foreign key (account_account_uid) references account (account_uid);
create index ix_style_account_9 on style (account_account_uid);



# --- !Downs

drop table if exists account cascade;

drop table if exists color_bar cascade;

drop table if exists dataset cascade;

drop table if exists font cascade;

drop table if exists icon cascade;

drop table if exists map cascade;

drop table if exists style cascade;

drop sequence if exists account_seq;

drop sequence if exists color_bar_seq;

drop sequence if exists dataset_seq;

drop sequence if exists font_seq;

drop sequence if exists icon_seq;

drop sequence if exists map_seq;

drop sequence if exists style_seq;


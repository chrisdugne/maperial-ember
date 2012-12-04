# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table public.colorbar (
  color_bar_uid             varchar(255) not null,
  name                      varchar(255),
  user_user_uid             varchar(255),
  constraint pk_colorbar primary key (color_bar_uid))
;

create table public.dataset (
  data_set_uid              varchar(255) not null,
  name                      varchar(255),
  upload_time               bigint,
  user_user_uid             varchar(255),
  constraint pk_dataset primary key (data_set_uid))
;

create table public.font (
  font_uid                  varchar(255) not null,
  name                      varchar(255),
  user_user_uid             varchar(255),
  constraint pk_font primary key (font_uid))
;

create table public.icon (
  icon_uid                  varchar(255) not null,
  name                      varchar(255),
  user_user_uid             varchar(255),
  constraint pk_icon primary key (icon_uid))
;

create table public.map (
  map_uid                   varchar(255) not null,
  name                      varchar(255),
  style_style_uid           varchar(255),
  colorbar_color_bar_uid    varchar(255),
  dataset_data_set_uid      varchar(255),
  user_user_uid             varchar(255),
  constraint pk_map primary key (map_uid))
;

create table public.style (
  style_uid                 varchar(255) not null,
  name                      varchar(255),
  user_user_uid             varchar(255),
  constraint pk_style primary key (style_uid))
;

create table public.user (
  user_uid                  varchar(255) not null,
  email                     varchar(255),
  name                      varchar(255),
  password                  varchar(255),
  constraint pk_user primary key (user_uid))
;

create sequence public.colorbar_seq;

create sequence public.dataset_seq;

create sequence public.font_seq;

create sequence public.icon_seq;

create sequence public.map_seq;

create sequence public.style_seq;

create sequence public.user_seq;

alter table public.colorbar add constraint fk_public.colorbar_user_1 foreign key (user_user_uid) references public.user (user_uid);
create index ix_public.colorbar_user_1 on public.colorbar (user_user_uid);
alter table public.dataset add constraint fk_public.dataset_user_2 foreign key (user_user_uid) references public.user (user_uid);
create index ix_public.dataset_user_2 on public.dataset (user_user_uid);
alter table public.font add constraint fk_public.font_user_3 foreign key (user_user_uid) references public.user (user_uid);
create index ix_public.font_user_3 on public.font (user_user_uid);
alter table public.icon add constraint fk_public.icon_user_4 foreign key (user_user_uid) references public.user (user_uid);
create index ix_public.icon_user_4 on public.icon (user_user_uid);
alter table public.map add constraint fk_public.map_style_5 foreign key (style_style_uid) references public.style (style_uid);
create index ix_public.map_style_5 on public.map (style_style_uid);
alter table public.map add constraint fk_public.map_colorbar_6 foreign key (colorbar_color_bar_uid) references public.colorbar (color_bar_uid);
create index ix_public.map_colorbar_6 on public.map (colorbar_color_bar_uid);
alter table public.map add constraint fk_public.map_dataset_7 foreign key (dataset_data_set_uid) references public.dataset (data_set_uid);
create index ix_public.map_dataset_7 on public.map (dataset_data_set_uid);
alter table public.map add constraint fk_public.map_user_8 foreign key (user_user_uid) references public.user (user_uid);
create index ix_public.map_user_8 on public.map (user_user_uid);
alter table public.style add constraint fk_public.style_user_9 foreign key (user_user_uid) references public.user (user_uid);
create index ix_public.style_user_9 on public.style (user_user_uid);



# --- !Downs

drop table if exists public.colorbar cascade;

drop table if exists public.dataset cascade;

drop table if exists public.font cascade;

drop table if exists public.icon cascade;

drop table if exists public.map cascade;

drop table if exists public.style cascade;

drop table if exists public.user cascade;

drop sequence if exists public.colorbar_seq;

drop sequence if exists public.dataset_seq;

drop sequence if exists public.font_seq;

drop sequence if exists public.icon_seq;

drop sequence if exists public.map_seq;

drop sequence if exists public.style_seq;

drop sequence if exists public.user_seq;


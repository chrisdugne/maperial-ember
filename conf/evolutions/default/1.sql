# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table public.colorbar (
  color_bar_uid             varchar(255) not null,
  constraint pk_colorbar primary key (color_bar_uid))
;

create table public.dataset (
  data_set_uid              varchar(255) not null,
  constraint pk_dataset primary key (data_set_uid))
;

create table public.map (
  map_uid                   varchar(255) not null,
  constraint pk_map primary key (map_uid))
;

create table public.style (
  style_uid                 varchar(255) not null,
  constraint pk_style primary key (style_uid))
;

create table public.user (
  user_uid                  varchar(255) not null,
  google_uid                varchar(255),
  email                     varchar(255),
  name                      varchar(255),
  password                  varchar(255),
  constraint pk_user primary key (user_uid))
;

create sequence public.colorbar_seq;

create sequence public.dataset_seq;

create sequence public.map_seq;

create sequence public.style_seq;

create sequence public.user_seq;




# --- !Downs

drop table if exists public.colorbar cascade;

drop table if exists public.dataset cascade;

drop table if exists public.map cascade;

drop table if exists public.style cascade;

drop table if exists public.user cascade;

drop sequence if exists public.colorbar_seq;

drop sequence if exists public.dataset_seq;

drop sequence if exists public.map_seq;

drop sequence if exists public.style_seq;

drop sequence if exists public.user_seq;


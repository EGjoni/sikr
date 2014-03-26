SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;


CREATE TABLE archiving (
    username character varying(100),
    post_count integer
);


CREATE TABLE chartest (
    string text,
    key character varying(10),
    id integer
);

CREATE TABLE posts (
    username character(100),
    post_link text,
    post_html text,
    post_raw text,
    title character varying(1000),
    type character varying(50),
    post_date timestamp with time zone,
    archive_date timestamp with time zone,
    state character varying(100),
    post_id bigint NOT NULL,
    vec tsvector,
    reblog_key character varying(100)
);

CREATE TABLE userstats (
    username character varying(150),
    postcount integer
);

ALTER TABLE ONLY posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (post_id);


ALTER TABLE ONLY userstats
    ADD CONSTRAINT username_unique UNIQUE (username);

CREATE UNIQUE INDEX archiving_username_idx ON archiving USING btree (username);

CREATE INDEX text_idx ON posts USING gin (vec);

CREATE INDEX user_idx ON posts USING btree (username);

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


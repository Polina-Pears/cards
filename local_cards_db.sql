--
-- PostgreSQL database dump
--

\restrict RCRz4WjTfQWONLIKsQ8mf6ihyXWjruu11aUeXg39ar6BSxgY3pj9TPpaneqCCeA

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
-- Dumped by pg_dump version 16.11 (Debian 16.11-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: profile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profile (
    id bigint NOT NULL,
    login text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    email text,
    name text,
    yandex_id text
);


--
-- Name: auth_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.auth_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auth_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.auth_id_seq OWNED BY public.profile.id;


--
-- Name: profile id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile ALTER COLUMN id SET DEFAULT nextval('public.auth_id_seq'::regclass);


--
-- Data for Name: profile; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.profile (id, login, password_hash, created_at, email, name, yandex_id) FROM stdin;
1	admin	$2b$10$IChvhWrnHTVpNnJI1gpRaeaFOsckzSa3cf929f9AMhQWwHcgQ0uva	2025-12-05 21:23:05.07771	\N	\N	\N
2	admin123	$2b$10$YJT27TYTobTMn53EvizwTOp8PcQYlh7S/r7oVhcI0VdfGVU4IMeW6	2025-12-05 21:29:02.475476	\N	\N	\N
3	supra@gmail.com	$2b$10$M/gHvco1uTPwhY4kKO8WrO8i9YzC4beNv24G.t.tUnaEg1Qwj14lu	2025-12-05 22:48:37.068884	\N	\N	\N
4	asdfghjk	$2b$10$tFvwGQQwartGiOW1di.rQ.hJt1V84YAwBgi5vQ9vaZkiI9iQQQRsS	2025-12-14 01:14:40.54443	asdfghjk@gmail.com	asdfghjk	\N
5	wertyuiop	$2b$10$hCq.7s8frpd1o.dXgBQjYuiPsjiB37/lnQb75cXRe2f2QQl.g12AW	2025-12-14 01:16:08.267659	wertyuio@dfghjkl.com	qwertyuio	\N
6	admin123123	$2b$10$tjgGEEYGyN.vPk2sp5UgSe1gCXtnMeVEnrz5AFJXbNoEQsRUUJL0a	2026-01-07 17:25:51.976204	test@test.ru	teest	\N
7	PolinaPears	$2b$10$LbWOmj3TWpVbEdEjkNhEdebquUXjCRZ2YbmpUFvAWpOEOC68zc4.e	2026-01-07 17:28:26.37666	sss@ss.ru	Polina	\N
8	root123	$2b$10$ZOFLSsVvNVmdYFO5EcH7He.7LIrkblApL5/PSjqbcRiu7k7ES1xUy	2026-01-08 21:30:50.448141	e.supranpolina@gmail.com	Супран Полина Максимовна	\N
\.


--
-- Name: auth_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_id_seq', 8, true);


--
-- Name: profile auth_login_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT auth_login_key UNIQUE (login);


--
-- Name: profile auth_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT auth_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict RCRz4WjTfQWONLIKsQ8mf6ihyXWjruu11aUeXg39ar6BSxgY3pj9TPpaneqCCeA


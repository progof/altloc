--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13
-- Dumped by pg_dump version 14.13

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

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: amigeez830290x
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO amigeez830290x;

--
-- Name: emotional_state; Type: TYPE; Schema: public; Owner: amigeez830290x
--

CREATE TYPE public.emotional_state AS ENUM (
    'VERY_BAD',
    'BAD',
    'NEUTRAL',
    'GOOD',
    'VERY_GOOD'
);


ALTER TYPE public.emotional_state OWNER TO amigeez830290x;

--
-- Name: task_difficulty; Type: TYPE; Schema: public; Owner: amigeez830290x
--

CREATE TYPE public.task_difficulty AS ENUM (
    'EASY',
    'MEDIUM',
    'HARD'
);


ALTER TYPE public.task_difficulty OWNER TO amigeez830290x;

--
-- Name: task_priority; Type: TYPE; Schema: public; Owner: amigeez830290x
--

CREATE TYPE public.task_priority AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH'
);


ALTER TYPE public.task_priority OWNER TO amigeez830290x;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: amigeez830290x
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO amigeez830290x;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: amigeez830290x
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE drizzle.__drizzle_migrations_id_seq OWNER TO amigeez830290x;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: amigeez830290x
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: admins; Type: TABLE; Schema: public; Owner: amigeez830290x
--

CREATE TABLE public.admins (
    email text NOT NULL
);


ALTER TABLE public.admins OWNER TO amigeez830290x;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: amigeez830290x
--

CREATE TABLE public.comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    description text NOT NULL,
    emotional_state VARCHAR(255),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.comments OWNER TO amigeez830290x;

--
-- Name: completed_tasks; Type: TABLE; Schema: public; Owner: amigeez830290x
--

CREATE TABLE public.completed_tasks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    task_id uuid NOT NULL,
    user_id uuid NOT NULL,
    completed_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.completed_tasks OWNER TO amigeez830290x;

--
-- Name: email_activations; Type: TABLE; Schema: public; Owner: amigeez830290x
--

CREATE TABLE public.email_activations (
    user_id uuid NOT NULL,
    activation_token uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.email_activations OWNER TO amigeez830290x;

--
-- Name: google_accounts; Type: TABLE; Schema: public; Owner: amigeez830290x
--

CREATE TABLE public.google_accounts (
    user_id uuid NOT NULL,
    google_id text NOT NULL
);


ALTER TABLE public.google_accounts OWNER TO amigeez830290x;

--
-- Name: habit_categories; Type: TABLE; Schema: public; Owner: amigeez830290x
--

CREATE TABLE public.habit_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.habit_categories OWNER TO amigeez830290x;

--
-- Name: habit_tasks; Type: TABLE; Schema: public; Owner: amigeez830290x
--

CREATE TABLE public.habit_tasks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id uuid NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    difficulty INT,
    priority VARCHAR(255),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.habit_tasks OWNER TO amigeez830290x;

--
-- Name: password_accounts; Type: TABLE; Schema: public; Owner: amigeez830290x
--

CREATE TABLE public.password_accounts (
    user_id uuid NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.password_accounts OWNER TO amigeez830290x;

--
-- Name: reset_password_requests; Type: TABLE; Schema: public; Owner: amigeez830290x
--

CREATE TABLE public.reset_password_requests (
    user_id uuid NOT NULL,
    reset_token uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.reset_password_requests OWNER TO amigeez830290x;

--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: amigeez830290x
--

CREATE TABLE public.user_sessions (
    session_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    user_role text NOT NULL
);


ALTER TABLE public.user_sessions OWNER TO amigeez830290x;

--
-- Name: users; Type: TABLE; Schema: public; Owner: amigeez830290x
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    email_verified boolean DEFAULT false NOT NULL,
    avatar_key text,
    role text DEFAULT 'user'::text NOT NULL,
    score integer DEFAULT 0 NOT NULL,
    level integer DEFAULT 1 NOT NULL,
    currency integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO amigeez830290x;

--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: amigeez830290x
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: amigeez830290x
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: admins admins_email_unique; Type: CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_unique UNIQUE (email);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: completed_tasks completed_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.completed_tasks
    ADD CONSTRAINT completed_tasks_pkey PRIMARY KEY (id);


--
-- Name: email_activations email_activations_pkey; Type: CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.email_activations
    ADD CONSTRAINT email_activations_pkey PRIMARY KEY (activation_token);


--
-- Name: email_activations email_activations_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.email_activations
    ADD CONSTRAINT email_activations_user_id_unique UNIQUE (user_id);


--
-- Name: google_accounts google_accounts_google_id_unique; Type: CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.google_accounts
    ADD CONSTRAINT google_accounts_google_id_unique UNIQUE (google_id);


--
-- Name: google_accounts google_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.google_accounts
    ADD CONSTRAINT google_accounts_pkey PRIMARY KEY (user_id);


--
-- Name: habit_categories habit_categories_name_unique; Type: CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.habit_categories
    ADD CONSTRAINT habit_categories_name_unique UNIQUE (name);


--
-- Name: habit_categories habit_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.habit_categories
    ADD CONSTRAINT habit_categories_pkey PRIMARY KEY (id);


--
-- Name: habit_tasks habit_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.habit_tasks
    ADD CONSTRAINT habit_tasks_pkey PRIMARY KEY (id);


--
-- Name: password_accounts password_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.password_accounts
    ADD CONSTRAINT password_accounts_pkey PRIMARY KEY (user_id);


--
-- Name: reset_password_requests reset_password_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.reset_password_requests
    ADD CONSTRAINT reset_password_requests_pkey PRIMARY KEY (reset_token);


--
-- Name: reset_password_requests reset_password_requests_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.reset_password_requests
    ADD CONSTRAINT reset_password_requests_user_id_unique UNIQUE (user_id);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (session_id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: unique_task_completion; Type: INDEX; Schema: public; Owner: amigeez830290x
--

CREATE UNIQUE INDEX unique_task_completion ON public.completed_tasks USING btree (task_id, user_id, completed_at);


--
-- Name: completed_tasks completed_tasks_task_id_habit_tasks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.completed_tasks
    ADD CONSTRAINT completed_tasks_task_id_habit_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.habit_tasks(id) ON DELETE CASCADE;


--
-- Name: completed_tasks completed_tasks_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.completed_tasks
    ADD CONSTRAINT completed_tasks_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: google_accounts google_accounts_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.google_accounts
    ADD CONSTRAINT google_accounts_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: habit_categories habit_categories_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.habit_categories
    ADD CONSTRAINT habit_categories_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: habit_tasks habit_tasks_category_id_habit_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.habit_tasks
    ADD CONSTRAINT habit_tasks_category_id_habit_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.habit_categories(id) ON DELETE CASCADE;


--
-- Name: habit_tasks habit_tasks_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: amigeez830290x
--

ALTER TABLE ONLY public.habit_tasks
    ADD CONSTRAINT habit_tasks_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


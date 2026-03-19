create table games
(
    id integer primary key,
    type text
);

create table players
(
    id text not null primary key,
    name text
);

create table game_players
(
    game_id integer not null,
    player_id text,
    id text not null primary key
);

create table throws
(
    id integer primary key,
    game_id integer,
    player_id text,
    score integer,
    modifier integer,
    x integer,
    y integer
);



-- Database definition for badjokecounter

CREATE DATABASE badjokecounter;

USE badjokecounter;

CREATE TABLE streamers(
    id TINYINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    -- Maximum Twitch username length allowed is 25
    streamer_name varchar(25) UNIQUE NOT NULL,
    score int DEFAULT 0,
    bad_jokes int DEFAULT 0,
    good_jokes int DEFAULT 0,
    morshu int DEFAULT 0,
    subscription_expiration int NOT NULL
);

CREATE TABLE score_history(
    id INT PRIMARY KEY AUTO_INCREMENT,
    streamer TINYINT,
    time_stamp int NOT NULL,
    FOREIGN KEY (streamer) REFERENCES streamers(id),
);

CREATE TABLE reporters(
    id INT PRIMARY KEY AUTO_INCREMENT,
    username varchar(25) UNIQUE NOT NULL,
    good_jokes int DEFAULT 0,
    bad_jokes int DEFAULT 0
);

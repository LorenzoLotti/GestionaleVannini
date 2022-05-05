DROP DATABASE IF EXISTS gestionale;
CREATE DATABASE gestionale;

USE gestionale;

CREATE TABLE IF NOT EXISTS product
(
	id INT NOT NULL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    address VARCHAR(128) NOT NULL,
    province VARCHAR(128) NOT NULL,
    price DOUBLE NOT NULL CHECK (price >= 0),
    quantity INT NOT NULL CHECK (quantity >= 0),
    status VARCHAR(128) NOT NULL
);
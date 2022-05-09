DROP DATABASE IF EXISTS gestionale;
CREATE DATABASE gestionale;

USE gestionale;

CREATE TABLE IF NOT EXISTS product
(
	id INT NOT NULL PRIMARY KEY,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    address_1 VARCHAR(128) NOT NULL,
    state VARCHAR(128) NOT NULL,
    total DOUBLE NOT NULL CHECK (total >= 0),
    quantity INT NOT NULL CHECK (quantity >= 0),
    status VARCHAR(128) NOT NULL
);
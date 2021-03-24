CREATE TABLE unicorns (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    age INT NOT NULL,
    color VARCHAR(10)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8;

CREATE TABLE owners (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    mobile VARCHAR(20)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8;

CREATE TABLE unicorn_owners (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    unicorn_id INT UNSIGNED,
    owner_id INT UNSIGNED
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8;

INSERT INTO luminus.owners (name, email, mobile) VALUES ('Bashaar', 'basharaq@gmail.com', '9788221100'), ('Hashem', 'hashem@gmail.com', '09788221100');
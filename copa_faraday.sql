CREATE DATABASE copa_arequipa;

USE copa_arequipa;

CREATE TABLE usuarios (
	id_usuario BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    nombre_usuario VARCHAR (255) NOT NULL,
    apellido_usuario VARCHAR (255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Creación de la tabla `equipos`
CREATE TABLE equipos (
    id_equipo BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    nombre_equipo VARCHAR(255) NOT NULL,
    genero VARCHAR(10) NOT NULL
);

-- Creación de la tabla `categorias`
CREATE TABLE categorias (
    id_categoria BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    nombre_categoria VARCHAR(50) NOT NULL,
    año_nacimiento_min INT NOT NULL,
    año_nacimiento_max INT NOT NULL
);

-- Creación de la tabla `jugadores`
CREATE TABLE jugadores (
    id_jugador BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    numero_camiseta INT,
    anio_nacimiento INT,
    genero VARCHAR(10) NOT NULL
);

-- Creación de la tabla relación `equipo_categoria`
CREATE TABLE equipo_categoria (
    id_equipo BINARY(16),
    id_categoria BINARY(16),
    genero VARCHAR(10) NOT NULL,
    PRIMARY KEY (id_equipo, id_categoria),
    FOREIGN KEY (id_equipo) REFERENCES equipos(id_equipo),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);


INSERT INTO categorias (nombre_categoria, año_nacimiento_min, año_nacimiento_max) VALUES ('U19', 2009, 2005);
INSERT INTO categorias (nombre_categoria, año_nacimiento_min, año_nacimiento_max) VALUES ('U17', 2011, 2007);
INSERT INTO categorias (nombre_categoria, año_nacimiento_min, año_nacimiento_max) VALUES ('U15', 2012, 2009);
INSERT INTO categorias (nombre_categoria, año_nacimiento_min, año_nacimiento_max) VALUES ('U13', 2013, 2011);
INSERT INTO categorias (nombre_categoria, año_nacimiento_min, año_nacimiento_max) VALUES ('U11', 2015, 2013);
INSERT INTO categorias (nombre_categoria, año_nacimiento_min, año_nacimiento_max) VALUES ('U9', 2017, 2015);


SELECT * FROM categorias;

-- $2a$05$Hjv5qhB1cmQJ166Pij11uOV4bNG/tVAUCoTf7W4KbZ75HReq3McKi

SELECT * FROM usuarios;

INSERT INTO usuarios (nombre_usuario, apellido_usuario, username, password) VALUES ('Mauricio', 'Aguilar', 'mau', '123');


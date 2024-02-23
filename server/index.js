const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const bcryptjs = require('bcryptjs')


app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'copa_arequipa'
})

app.post('/create', (req, res) => {
    const nombre = req.body.nombre
    const apellido = req.body.apellido
    const numero_camiseta = req.body.numeroCamiseta 
    const anio_nacimiento = req.body.anioNacimiento
    const genero = req.body.genero

    db.query('INSERT INTO jugadores (nombre, apellido,  numero_camiseta, anio_nacimiento, genero) VALUES (?,?,?,?,?)', [nombre, apellido, numero_camiseta, anio_nacimiento, genero], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("Jugador registrado exitosamente")
        }
    })
})

app.get('/jugadores', (req, res) => {
    const query = 'SELECT BIN_TO_UUID(id_jugador) AS idJugador, nombre, apellido, anio_nacimiento, numero_camiseta, genero FROM jugadores';
    db.query(query, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.put('/update', (req, res) => {
    const id = req.body.id
    const nombre = req.body.nombre
    const apellido = req.body.apellido
    const anio_nacimiento = req.body.anioNacimiento
    const numero_camiseta = req.body.numeroCamiseta
    const genero = req.body.genero

    db.query('UPDATE jugadores SET nombre = ?, apellido = ?, anio_nacimiento = ?, numero_camiseta = ?, genero = ? WHERE id_jugador = UUID_TO_BIN(?)', [nombre, apellido, anio_nacimiento, numero_camiseta, genero, id], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send('Error al actualizar el jugador')
        } else {
            res.send("Jugador actualizado exitosamente")
        }
    })
})

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id

    db.query('DELETE FROM jugadores WHERE id_jugador = UUID_TO_BIN(?)', [id], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send('Error al actualizar el jugador')
        } else {
            res.send("Jugador eliminado con éxito")
        }
    })
})

/*conexiones con la tabla equipos*/

app.post('/equipos/create', (req, res) => {
    const nombre = req.body.nombre
    const genero = req.body.genero

    db.query('INSERT INTO equipos (nombre, genero) VALUES (?,?)', [nombre, genero],
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("Equipo registrado exitosamente")
        }
    })
})


app.get('/equipos', (req, res) => {
    const query = 'SELECT BIN_TO_UUID(id_equipo) AS idEquipo, nombre, genero FROM equipos';
    db.query(query, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.put('/equipos/update', (req, res) => {
    const id = req.body.id
    const nombre = req.body.nombre
    const genero = req.body.genero

    db.query('UPDATE equipos SET nombre = ?, genero = ? WHERE id_equipo = UUID_TO_BIN(?)', [nombre, genero, id], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send('Error al actualizar el equipo')
        } else {
            res.send("Equipo actualizado exitosamente")
        }
    })
})

app.delete('/equipos/delete/:id', (req, res) => {
    const id = req.params.id

    db.query('DELETE FROM equipos WHERE id_equipo = UUID_TO_BIN(?)', [id], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send('Error al actualizar el equipo')
        } else {
            res.send("Equipo eliminado con éxito")
        }
    })
})


/*login and submit*/

app.post('/usuarios/submit', async (req, res) => {
    const nombre_usuario = req.body.nombre_usuario
    const apellido_usuario = req.body.apellido_usuario
    const username = req.body.username
    const password = req.body.password

    // Validar que todos los campos están presentes
    if (!nombre_usuario || !apellido_usuario || !username || !password) {
        return res.status(400).send('Por favor, complete todos los campos.');
    }

    try {
        // Encriptar la contraseña
        const salt = await bcryptjs.genSalt(5); // 10 es un valor comúnmente usado para bcrypt
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Insertar el nuevo usuario en la base de datos con la contraseña encriptada
        db.query('INSERT INTO usuarios (nombre_usuario, apellido_usuario, username, password) VALUES (?, ?, ?, ?)', [nombre_usuario, apellido_usuario, username, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error al registrar el usuario:', err);
                res.status(500).send('Error al registrar el usuario.');
            } else {
                res.status(201).send({status: "ok", message: 'Usuario registrado exitosamente.'});
            }
        });
    } catch (error) {
        console.error('Error al encriptar la contraseña:', error);
        res.status(500).send('Error al procesar la solicitud.');
    }
})

app.post('/usuario/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    db.query('SELECT * FROM usuarios WHERE username = ?', [username], async(err, result) => {
        if (err) {
            console.error('Error al buscar el usuario:', err)
            return res.status(500).send('Error al procesar la solicitud.')
        }
        if (result.length > 0) {
            const user = result[0]

            const isMatch = await bcryptjs.compare(password, user.password)
            if(isMatch) {
                res.send({message: "Usuario autenticado"})
            } else {
                res.status(401).send({message: "Usuario o contraseña incorrectos"})
            }
        } else {
            res.status(404).send({message: "Usuario no encontrado"})
        }
    })
})

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
const express = require('express');
const fs = require('fs');
const path = require('path')

const app = express();
const PORT = 3000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

//Crear middleware para acceder a la carpeta anime
app.use(express.static(path.join(__dirname, '/')));


// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Ruta para obtener todos los animes
app.get('/animes', (req, res) => {
    fs.readFile('anime.JSON', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al leer los datos de los animes.' });
        }

        const animes = JSON.parse(data);
        res.json(animes);
    });
});

// Ruta para obtener un anime por su id
app.get('/animes/:id', (req, res) => {
    const id = req.params.id;

    fs.readFile('anime.JSON', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al leer los datos de los animes.' });
        }

        const animes = JSON.parse(data);
        const anime = animes[id];

        if (!anime) {
            return res.status(404).json({ error: 'Anime no encontrado.' });
        }

        res.json(anime);
    });
});

// Ruta para agregar un nuevo anime

app.post("/animes", (req, res) => {

    const anime = req.body;
    fs.readFile("anime.json", "utf8", (err, data) => {

        if (err) {
            console.error(err);
            res.status(500).send("Error en el servidor");
        } else {
            const animes = JSON.parse(data);
            let maxId = 0;
            for (const id in animes) {
                if (animes.hasOwnProperty(id)) {
                    const currentId = parseInt(id);
                    if (currentId > maxId) {
                        maxId = currentId;
                    }
                }
            }
            const newId = maxId + 1;
            animes[newId.toString()] = { ...anime };
            fs.writeFile(
                "anime.json",
                JSON.stringify(animes, null, 2),
                "utf8",
                (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Error en el servidor");
                    } else {
                        res.send("Anime agregado correctamente");
                    }
                }
            );
        }
    });
});

// Ruta para actualizar (update) un anime existente
app.put('/animes/:id', (req, res) => {
    const id = req.params.id;
    const animeUpdates = req.body;

    fs.readFile('anime.JSON', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al leer los datos de los animes.' });
        }

        const animes = JSON.parse(data);
        const anime = animes[id];

        if (!anime) {
            return res.status(404).json({ error: 'Anime no encontrado.' });
        }

        const updatedAnime = { ...anime, ...animeUpdates };
        animes[id] = updatedAnime;

        fs.writeFile('anime.JSON', JSON.stringify(animes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al guardar los cambios en el anime.' });
            }

            res.json({ message: 'Anime actualizado exitosamente.' });
        });
    });
});

// Ruta para eliminar un anime existente
app.delete('/animes/:id', (req, res) => {
    const id = req.params.id;

    fs.readFile('anime.JSON', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al leer los datos de los animes.' });
        }

        const animes = JSON.parse(data);

        if (!animes[id]) {
            return res.status(404).json({ error: 'Anime no encontrado.' });
        }

        delete animes[id];

        fs.writeFile('anime.JSON', JSON.stringify(animes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al guardar los cambios en el anime.' });
            }

            res.json({ message: 'Anime eliminado exitosamente.' });
        });
    });
});
// Ruta para buscar un anime por su nombre
app.get('/animes/search/:nombre', (req, res) => {
    const nombre = req.params.nombre.toLowerCase();
    fs.readFile('anime.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al leer los datos de los animes.' });
        }
        const animes = JSON.parse(data);
        const anime = Object.values(animes).find(
            (a) => a.nombre.toLowerCase() === nombre
        );
        if (!anime) {
            return res.status(404).json({ error: 'Anime no encontrado.' });
        }
        res.json(anime);
    });
});







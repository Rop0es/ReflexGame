const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

app.use(express.json());

const dbConfig = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'juego_db'
};

async function initDB() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS leaderboard (
                id INT AUTO_INCREMENT PRIMARY KEY,
                initials VARCHAR(3),
                points INT
            )
        `);
        console.log("Base de datos y tabla listas");
        await connection.end();
    } catch (err) {
        console.log("Esperando a la base de datos...", err.message);
        setTimeout(initDB, 5000); // Reintenta si falla
    }
}
initDB();

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Reflex Game MariaDB</title>
            <style>
                body { text-align: center; font-family: sans-serif; background: #1a1a1a; color: white; padding-top: 50px; }
                #game-container { background: #333; width: 400px; margin: 0 auto; padding: 30px; border-radius: 15px; }
                .key-display { font-size: 80px; font-weight: bold; color: #00ff88; margin: 20px 0; height: 100px; }
                #btn-start { padding: 15px 30px; font-size: 20px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 5px; }
                .hidden { display: none; }
            </style>
        </head>
        <body>
            <div id="game-container">
                <h1>⚡ REFLEX TEST (SQL)</h1>
                <div id="setup"><button id="btn-start">EMPEZAR (60s)</button></div>
                <div id="game" class="hidden">
                    <div>Tiempo: <span id="timer">60</span>s | Puntos: <span id="score">0</span></div>
                    <div class="key-display" id="current-key">-</div>
                </div>
                <div id="result" class="hidden">
                    <h2>¡FIN!</h2>
                    <input type="text" id="initials" maxlength="3" placeholder="AAA" style="width:50px; text-align:center;">
                    <button onclick="saveScore()">GUARDAR</button>
                </div>
            </div>
            <script>
                let score = 0, timeLeft = 60, currentTarget = '', timerInterval;
                const keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                document.getElementById('btn-start').onclick = () => {
                    score = 0; timeLeft = 60;
                    document.getElementById('setup').classList.add('hidden');
                    document.getElementById('game').classList.remove('hidden');
                    nextKey(); startTimer();
                };
                function nextKey() {
                    currentTarget = keys[Math.floor(Math.random() * keys.length)];
                    document.getElementById('current-key').innerText = currentTarget;
                }
                window.onkeydown = (e) => {
                    if (e.key.toUpperCase() === currentTarget && timeLeft > 0) {
                        score++; document.getElementById('score').innerText = score; nextKey();
                    }
                };
                function startTimer() {
                    timerInterval = setInterval(() => {
                        timeLeft--; document.getElementById('timer').innerText = timeLeft;
                        if (timeLeft <= 0) { clearInterval(timerInterval); endGame(); }
                    }, 1000);
                }
                function endGame() {
                    document.getElementById('game').classList.add('hidden');
                    document.getElementById('result').classList.remove('hidden');
                }
                function saveScore() {
                    const ini = document.getElementById('initials').value || 'NNN';
                    fetch('/save', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({initials: ini, points: score})
                    }).then(() => { alert('¡Guardado!'); location.reload(); });
                }
            </script>
        </body>
        </html>
    `);
});

app.post('/save', async (req, res) => {
    try {
        const { initials, points } = req.body;
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO leaderboard (initials, points) VALUES (?, ?)', [initials, points]);
        await connection.end();
        res.sendStatus(200);
    } catch (err) { res.status(500).send(err.message); }
});

app.listen(8080, () => console.log('Juego listo en puerto 8080'));
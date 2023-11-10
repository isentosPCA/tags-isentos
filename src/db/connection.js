//incluir dependencia mysql
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: '',
  port: 3306 // Porta padrão do MySQL
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    throw err;
  }
  console.log('Conexão bem-sucedida com o MySQL');
});

module.exports = connection;

const express = require("express");
const app = express();
const connection = require('./src/db/connection');
const bodyParser = require("body-parser");
const fs = require('fs');
const csv = require('csv-parser');
const multer = require('multer');
const upload = multer({
    dest: 'uploads/'
}); // Especifique o diretório onde os arquivos devem ser armazenados
const crypto = require('crypto');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const qr = require('qrcode');
//const qr = require('qr-image');

const {
    format
} = require("path");

let isAuthenticated = false;


app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/form', (req, res) => {
    if (isAuthenticated) {
        res.render('formulario.ejs');

    } else {
        // Se não estiver autenticado, redirecione para a página de login
        res.redirect('/login');
    }
});

app.get('/index', (req, res) => {
    res.render('index'); // Renderize a página index.ejs
});

app.get('/', (req, res) => {
    res.render('index', {
        nenhumResultado: false
    })
})

app.get('/index', (req, res) => {
    res.render('index', {
        nenhumResultado: false
    }); // Renderize a página index.ejs
});

app.get('/confirmacao', (req, res) => {
    res.render('confirmacao');
})

app.get('/placa-nao-cadastrada', (req, res) => {
    const placa = req.query.placa; // Obtém a placa da consulta na URL
    res.render('placa-nao-cadastrada', {
        placa
    });
});

app.get('/login', (req, res) => {
    res.render('login');

});

app.get('/logout', (req, res) => {
    isAuthenticated = false; // Defina a autenticação como falsa
    res.redirect('/login'); // Redirecione para a página de login
});

app.get('/homeLote', (req, res) => {
    res.render('homeLote');
});

app.get('/home', (req, res) => {
    const { hashcode, subhash, buttonRadio } = req.query;
    console.log("Codigo enviado no GET: ", hashcode);
    console.log("Subhash enviado: ", subhash)
    console.log("Value buttonRadio", buttonRadio);

    if(buttonRadio == 1){

        const query = "SELECT placa, n_tag, orgao, DATE_FORMAT(data_vigencia, '%d/%m/%Y') AS data_formatada, status FROM info_tags WHERE hashcode = ?";

        connection.query(query, [hashcode], (error, results) => {
            if (error) {
                console.error("Erro ao buscar informações no banco:", error);
                res.send("Erro ao buscar informações no banco.");
            } else {
                if (results.length > 0) {
                    const informacoes = results[0];
                    console.log("Informações encontradas no banco:", informacoes);

                    // Gerar o QR code como uma imagem
                    qr.toDataURL(`192.168.0.16:3000/home?hashcode=${hashcode}`, (err, qrDataURL) => {
                        if (err) {
                            console.error("Erro ao gerar o QR code: ", err);
                            res.send("Erro ao gerar o QR code.");
                        } else {
                            const decodedQrDataURL = decodeURIComponent(qrDataURL);
                            
                            // Renderize o template EJS 'home' e passe as informações e o QR code
                            res.render('home', {
                                informacoes,
                                decodedQrDataURL
                            });
                        }
                    });
                } else {
                    console.log("não encontrou nada no banco");
                    res.render('index', {
                        nenhumResultado: true
                    });
                }
            }
        })

    } //end IF

    else {
        const query = "SELECT placa, n_tag, orgao, DATE_FORMAT(data_vigencia, '%d/%m/%Y') AS data_formatada, status, hashcode FROM info_tags WHERE subhash = ?";
        
        connection.query(query, [subhash], (error, results) => {
            if (error) {
                console.error("Erro ao buscar informações no banco:", error);
                res.send("Erro ao buscar informações no banco.");
            } else {
                if (results.length > 0) {
                    // Crie um array para armazenar os QR codes e informações de cada veículo
                    const qrDataArray = [];
                    console.log("Informações encontradas no banco:", results);
        
                    results.forEach((veiculo) => {
                        // Gere o QR code como uma imagem para cada veículo
                        qr.toDataURL(`192.168.0.16:3000/home?buttonRadio=1&hashcode=${veiculo.hashcode}`, (err, qrDataURL) => {
                            console.log(`192.168.0.16:3000/home?buttonRadio=1&hashcode=${veiculo.hashcode}`)
                            if (err) {
                                console.error("Erro ao gerar o QR code: ", err);
                                res.send("Erro ao gerar o QR code.");
                            } else {
                                const decodedQrDataURL = decodeURIComponent(qrDataURL);
        
                                // Adicione o link do QR code e as informações do veículo ao array
                                qrDataArray.push({
                                    qrCode: decodedQrDataURL,
                                    infoVeiculo: veiculo
                                });
        
                                // Verifique se todos os QR codes foram gerados
                                if (qrDataArray.length === results.length) {
                                    // Renderize o template EJS 'home' e passe os QR codes e informações
                                    res.render('homeLote', {
                                        qrDataArray
                                    });
                                }
                            }
                        });
                    });
                } else {
                    console.log("Não encontrou nada no banco");
                    res.render('index', {
                        nenhumResultado: true
                    });
                }
            }
        });
    }
       
});


//INSERÇÃO NO BANCO DE DADOS

app.post('/form', (req, res) => {
    const {
        placa,
        orgao,
        data_vigencia,
        tag,
        hash,
        status,
        buttonRadio
    } = req.body;


    if (buttonRadio == 1) {

        // Inserir no banco de dados
        const query = "INSERT INTO `info_tags` (`id`, `placa`, `hashcode`, `n_tag`, `orgao`, `data_vigencia`, `status`) VALUES (NULL, ?, ?, ?, ?, ?, ?)";
        console.log(buttonRadio);
        connection.query(query, [placa, hash, tag, orgao, data_vigencia, status], (error, results) => {
            if (error) {
                console.error("Erro ao inserir no banco: ", error);
                res.send("Erro ao inserir informações no banco.");
            } else {
                console.log("Inserção bem-sucedida");
                res.redirect('/confirmacao');
                
            }
        });
    } else {
        // Verificar se a placa existe no banco de dados
        const checkQuery = "SELECT placa FROM info_tags WHERE placa = ?";
        connection.query(checkQuery, [placa], (checkError, checkResults) => {
            if (checkError) {
                console.error("Erro ao verificar placa no banco: ", checkError);
                res.send("Erro ao verificar placa no banco de dados.");
            } else {
                if (checkResults.length === 0) {
                    // A placa não existe, redirecione para a página de alerta
                    res.redirect(`/placa-nao-cadastrada?placa=${placa}`);
                } else {
                    // A placa existe no banco de dados, continue com a atualização
                    const updateQuery = "UPDATE `info_tags` SET status = ? WHERE placa = ?";
                    connection.query(updateQuery, [status, placa], (updateError) => {
                        if (updateError) {
                            console.error("Erro ao atualizar no banco: ", updateError);
                            res.send('Erro ao atualizar informações no banco.');
                        } else {
                            console.log("Atualização bem-sucedida");
                            res.redirect('/confirmacao');
                        }
                    });
                }
            }
        });
    }
});

app.post('/upload-csv', upload.single('importar-lote'), (req, res) => {
    const csvFilePath = req.file.path; // Caminho do arquivo CSV enviado pelo formulário

    // Lê o arquivo CSV e insere ou atualiza os dados no banco de dados com base na escolha do usuário
    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            // Mapeia as colunas do CSV para os campos do banco de dados
            const {
                placa,
                orgao,
                data_vigencia,
                tag,
                hash,
                subhash,
                status
            } = row;

            if (req.body.buttonRadio === "1") {
                // Inserir no banco de dados
                const insertQuery = "INSERT INTO `info_tags` (`placa`, `orgao`, `data_vigencia`, `n_tag`, `hashcode`, `subhash`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?)";
                connection.query(insertQuery, [placa, orgao, data_vigencia, tag, hash, subhash, status], (error, results) => {
                    if (error) {
                        console.error("Erro ao inserir no banco: ", error);
                    } else {
                        console.log("Inserção bem-sucedida");
                    }
                });
            } else if (req.body.buttonRadio === "2") {
                // Verificar se a placa existe antes de fazer a atualização
                const checkQuery = "SELECT placa FROM info_tags WHERE placa = ?";
                connection.query(checkQuery, [placa], (checkError, checkResults) => {
                    if (checkError) {
                        console.error("Erro ao verificar placa no banco: ", checkError);
                    } else if (checkResults.length === 0) {
                        // A placa não existe, redirecione para a página de alerta
                        res.redirect(`/placa-nao-cadastrada?placa=${placa}`);
                    } else {
                        // A placa existe no banco de dados, continue com a atualização
                        const updateQuery = "UPDATE `info_tags` SET status = ? WHERE placa = ?";
                        connection.query(updateQuery, [status, placa], (updateError) => {
                            if (updateError) {
                                console.error("Erro ao atualizar no banco: ", updateError);
                            } else {
                                console.log("Atualização bem-sucedida");
                            }
                        });
                    }
                });
            }
        })
        .on('end', () => {
            console.log('Leitura do arquivo CSV concluída.');
            // Após a inserção ou atualização de todos os dados, redirecione para alguma página de confirmação
            res.redirect('/confirmacao');
        })
        .on('error', (error) => {
            console.error('Erro na leitura do arquivo CSV: ', error);
            res.send('Erro na leitura do arquivo CSV.');
        });
});


//codigo parar criar usuario

app.post('/login/register', (req, res) => {
    const {
        matriculaRegistro,
        passwordRegistro,
        tokenConfirm
    } = req.body;

    // Validar entrada
    if (!matriculaRegistro || !passwordRegistro || !tokenConfirm) {
        return res.status(400).json({
            error: 'Todos os campos são obrigatórios'
        });
    }

    // Token sempre definido como 'admin1354'
    const token = 'admin1354';

    console.log('Token gerado:', token);
    console.log('Token confirmado:', tokenConfirm);

    // Verificar o token JWT
    if (token !== tokenConfirm) {
        console.error('Token JWT inválido');
        return res.status(400).json({
            error: 'Token JWT inválido'
        });
    }

    // Hash da senha
    bcrypt.hash(passwordRegistro, 10, (hashError, hash) => {
        if (hashError) {
            console.error(hashError);
            return res.status(500).json({
                error: 'Erro ao criar o hash da senha'
            });
        }

        // Verificar se a matrícula já existe na tabela
        const checkQuery = "SELECT * FROM `login` WHERE matricula = ?";
        connection.query(checkQuery, [matriculaRegistro], (checkError, checkResult) => {
            if (checkError) {
                console.error(checkError);
                return res.status(500).json({
                    error: 'Erro ao verificar matrícula'
                });
            }
            if (checkResult.length > 0) {
                return res.status(409).json({
                    error: 'Matrícula já está em uso'
                });
            }

            // Inserir usuário no banco de dados
            const insertQuery = "INSERT INTO `login` (matricula, senha_hash) VALUES (?, ?)";
            connection.query(insertQuery, [matriculaRegistro, hash], (queryError) => {
                if (queryError) {
                    console.error(queryError);
                    return res.status(500).json({
                        error: 'Erro ao inserir usuário no banco de dados'
                    });
                }

                // Redirecionar para a página de login
                return res.redirect('/login');
            });
        });
    });
});


// Rota de login

app.post('/login/acess', (req, res) => {
    const {
        matriculaLogin,
        passwordLogin
    } = req.body;

    // Validar entrada
    if (!matriculaLogin || !passwordLogin) {
        return res.render('error', { message: 'Matrícula e senha são obrigatórios' });
    }

    // Consulta SQL para encontrar o usuário
    const query = 'SELECT * FROM login WHERE matricula = ?';
    connection.query(query, [matriculaLogin], (error, result) => {
        if (error) {
            return res.render('errorLogin', { message: 'Erro interno do servidor' });
        }

        if (!result || result.length === 0) {
            return res.render('errorLogin', { message: 'Matrícula ou senha incorretos' });
        }

        const user = result[0];
        const storedPasswordHash = user.senha_hash; // Obtém o hash da senha armazenada no banco de dados

        // Comparar a senha fornecida com o hash da senha armazenada usando bcrypt
        bcrypt.compare(passwordLogin, storedPasswordHash, (err, passwordMatch) => {
            if (err) {
                return res.render('errorLogin', { message: 'Erro interno do servidor' });
            }

            if (!passwordMatch) {
                return res.render('errorLogin', { message: 'Matrícula ou senha incorretos' });
            }

            // Se a senha corresponder, você pode gerar um token JWT aqui
            const token = jwt.sign({
                matricula: matriculaLogin
            }, 'secreto', {
                expiresIn: '1h'
            });

            isAuthenticated = true; // Defina a autenticação como verdadeira

            res.render('formulario');
        });
    });
});


// Middleware para lidar com rotas não encontradas

app.use((req, res, next) => {
    res.status(404).render('error', { message: 'Página não encontrada' });
});


app.listen(3000, () => {
    console.log("Servidor ligado na porta 3000!");
})


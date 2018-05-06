const express = require('express');
const path = require('path');

const app = express();

// define o protocolo http
const server =  require('http').createServer(app);
// define o protocolo wss para o websocket
// retorna uma funcao, chamamos diretamente com o server
const io =  require('socket.io')(server);

// definicao da pasta onde ficarao os arquivos publicos utilizados pela aplicação
// arquivos front-end
app.use(express.static(path.join(__dirname, 'public')));

// configuração informando que as views serão em html e não ejs
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// informa que quando acessar esse caminho renderizará o index com html
app.use('/', (req, res) => {
    res.render('index.html');
});

let messages = [];

// diz o que acontecerá quando algum cliente se conectar ao socket
// Neste caso dará um console.log passando o id de quem estará conectado
// Ouve a mensagem
io.on('connection', socket => {
    console.log('Socket conectado: ' + socket.id);
    
    socket.on('sendMessage', data => {
        messages.push(data);

        //---------------------------------------------------
        // o socket possui tres eventos principais
        // 1º
        // envia as informacoes para apenas esse socket
        // socket.emit();
        //---------------------------------------------------
        // 2º
        // ouve
        // socket.on();
        //---------------------------------------------------
        // 3º
        // Envia para todos os sockets conectados na aplicacao
        // socket.broadcast.emit();

        // nome(receivedMessage) e o que vai enviar(nome e mensagem)!
        socket.broadcast.emit('receivedMessage', data);


    });
});

// significa que está ouvindo a porta 3000
server.listen(3123);
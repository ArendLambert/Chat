// server.js
const { Server } = require('socket.io');
const fs = require('fs');
const https = require('https');

// Настройка SSL сертификата
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/your-domain/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/your-domain/fullchain.pem')
};

// Создаем HTTPS сервер
const httpsServer = https.createServer(options);

// Инициализируем Socket.IO с HTTPS сервером
const io = new Server(httpsServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Указываем порт для сервера
const PORT = process.env.PORT || 3001;
httpsServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});

const users = new Map();  // Храним пользователей по их ID

io.on('connection', (socket) => {
  console.log('User connected: ', socket.id);

  // Отправляем клиенту его ID
  socket.emit('your-id', socket.id);

  // Сохраняем подключение пользователя
  users.set(socket.id, socket);

  socket.on('offer', (offer, to) => {
    console.log(`Received offer from ${socket.id} to ${to}`);  // Логируем ID отправителя и получателя
    const targetSocket = users.get(to);
    console.log('Currently connected users:');
      users.forEach((socket, id) => {
      console.log(`User ID: ${id}`);
    });
    if (targetSocket) {
      console.log(`Forwarding offer from ${socket.id} to ${to}`);  // Логируем, что нашли целевого пользователя
      targetSocket.emit('offer', offer);  // Отправляем offer собеседнику
    } else {
      console.log('OFFER User not connected: ' + to);  // Если не нашли, логируем
    }
  });
  

  socket.on('answer', (answer, to) => {
    const targetSocket = users.get(to);
    if (targetSocket) {
      console.log(`Forwarding answer from ${socket.id} to ${to}`);
      targetSocket.emit('answer', answer);  // Отправляем answer собеседнику
    } else {
      console.log('ANSWER User not connected: ' + to);
    }
  });

  // socket.on('candidate', (candidate, to) => {
  //   const targetSocket = users.get(to);
  //   if (targetSocket) {
  //     console.log(`Forwarding ICE candidate from ${socket.id} to ${to}`);
  //     targetSocket.emit('candidate', candidate);  // Отправляем ICE candidate собеседнику
  //   } else {
  //     console.log('User not connected: ' + candidate);
  //   }
  // });

  socket.on('candidate', (candidate, otherUserId) => {
    console.log('Sending candidate to:', otherUserId);
    socket.to(otherUserId).emit('candidate', candidate); // Передаем кандидата другому пользователю
  });
  

  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id);
    users.delete(socket.id);  // Удаляем пользователя из списка при отключении
  });
});

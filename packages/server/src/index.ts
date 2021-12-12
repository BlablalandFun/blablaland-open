import net from 'net';

net.createServer((socket) => {
  console.log(socket.remoteAddress);
}).listen(843).on('listening', () => {
  console.log('Server listening on port 843');
  console.log('ok!!')
})
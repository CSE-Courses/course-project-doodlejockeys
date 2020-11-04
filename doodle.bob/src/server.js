const io = require('socket.io')();
const port = 8000;


io.on('connection', (client) => {
	console.log(`${io.engine.clientsCount} user  connected.`);
	next();
});


io.listen(port);
console.log('listening on port ', port);
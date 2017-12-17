var ws = require("nodejs-websocket")

var client = ws.connect("ws://127.0.0.1:27878", function() {
	console.log('Connected');
});

client.on('text', function incoming(data) {
	console.log('Received: ' + data);
});

client.on('close', function() {
	console.log('Connection closed');
});
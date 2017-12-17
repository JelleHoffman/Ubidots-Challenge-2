/**
 * The sum server itself.
 * The client-side JavaScript doesn't support raw TCP connections.
 * I used websockets so I could receive data in index.html 
 */
var ws = require("nodejs-websocket")
var schedule = require('node-schedule');

var results = [];

//Creating a rule to send the messages every second. 
var rule = new schedule.RecurrenceRule();
rule.second = new schedule.Range(0, 59);

//Creating the server that will send the results to the connected clients every second.
var sending_server = ws.createServer(function(socket) {
	console.log("Sending data on port 27878");
	
	//Creating a time schedule to send the results
	var j = schedule.scheduleJob(rule, function(){
		  broadcastResults(sending_server.connections,results);
		  results = [];
		});
	
	//Calculating the sum of the results and than sending the results
	function broadcastResults(clients,results){
		var sum = 0;
		results.forEach(function (result){
			sum = sum + Number(result);
		});
		
		if(sum === 0){
			console.log("The sum of the results was 0");
		}else{
			console.log("The sum of the results was "+sum);
		}
		
		clients.forEach(function (client) {
		      client.send(""+sum);
		  });
	}	
});

//Creating a server that will receive number and push those into the results array.
var receiving_server = ws.createServer(function(conn){
	conn.on('text', function (data) {
		console.log("Receiving data on port 27877");
	    if(data> 0 && data < 21){
	    	results.push(data);
	    }else{
	    	conn.close();
	    }
	  });
	conn.on("close", function (code, reason) {
		console.log("Connection closed")
	})
});

//Initializing the servers on the specific ports
receiving_server.listen(27877, '127.0.0.1');
sending_server.listen(27878, '127.0.0.1');
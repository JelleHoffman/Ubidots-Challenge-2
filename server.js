var ws = require("nodejs-websocket")
var schedule = require('node-schedule');

var results = [];

var rule = new schedule.RecurrenceRule();
rule.second = new schedule.Range(0, 59);

var sending_server = ws.createServer(function(socket) {
	console.log("Sending data on port 27878");
	
	var j = schedule.scheduleJob(rule, function(){
		  broadcastResults(sending_server.connections,results);
		  results = [];
		});
	
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


receiving_server.listen(27877, '127.0.0.1');
sending_server.listen(27878, '127.0.0.1');
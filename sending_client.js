/**
 * A automated script to send a random number under 20 every second to the server
 */
var ws = require("nodejs-websocket");
var schedule = require('node-schedule');

//Creating a rule to send the messages every second. 
var rule = new schedule.RecurrenceRule();
rule.second = new schedule.Range(0, 59);


var client = ws.connect('ws://127.0.0.1:27877', function() {
	console.log('Connected');
	
	//Creating a timed task and sending a random number to the sum server. 
	var j = schedule.scheduleJob(rule, function(){
		  var number =  Math.round(Math.random() * 19 + 1);
		  console.log("Sending the number: " + number);
		  client.send(""+number);
		});
});

client.on('close', function() {
	console.log('Connection closed');
});
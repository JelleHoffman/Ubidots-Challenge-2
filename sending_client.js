var ws = require("nodejs-websocket");
var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
rule.second = new schedule.Range(0, 59);

var client = ws.connect('ws://127.0.0.1:27877', function() {
	console.log('Connected');
	var j = schedule.scheduleJob(rule, function(){
		  var number =  Math.round(Math.random() * 19 + 1);
		  console.log("Sending the number: " + number);
		  client.send(""+number);
		});
});

client.on('close', function() {
	console.log('Connection closed');
});
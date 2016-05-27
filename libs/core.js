var request = require('request');
var WebSocket = require('ws');

module.exports = Core;

function Core() {

}

Core.prototype.connection = function($this, callback) {
	var hearthbeat;
	var len_guilds;
	request('https://discordapp.com/api/gateway', function(err, res, body) {
		if (!err && res.statusCode == 200) {
			var ws = new WebSocket(JSON.parse(body).url);
			ws.once('open', function(){
				var connect = {
					op: 2,
					d: {
					    token: $this.token,
						v: 4,
						encoding: "etf",
					    properties: {
					        $os: require('os').platform(),
					        $browser: "discord-api",
					        $device: "discord-api",
					        $referrer: "",
					        $referring_domain: ""
					    },
					    compress: false,
					    large_threshold: 250,
					    shard: [0, 1]
					}
				}
				ws.send(JSON.stringify(connect));
			});
			ws.once('close', function(code, data) {
				console.error(data);
			});
			ws.once('error', function(code, data) {
				console.error(data);
			});
			ws.on('message', function(data, flags) {
				message = JSON.parse(data);
				var label = message.t;
				var sequence = message.s;
				switch(label){
					case "READY":
						var interval = message.d.heartbeat_interval;
						hearthbeat = setInterval(function(){
							ws.send(JSON.stringify({
								op: 1,
								d: sequence
							}));
						}, interval);
						len_guilds = message.d.guilds.length;
						$this.id = message.d.user.id;
						break;
					case "GUILD_CREATE":
						var guild = {
							id: message.d.id,
							name: message.d.name,
							owner_id: message.d.owner_id,
							channels: message.d.channels,
							members: message.d.members,
							afk_channel_id: message.d.afk_channel_id
						};

						$this.guilds[$this.guilds.length] = guild;

						if($this.guilds.length == len_guilds){
							callback(ws);
						}
						break;
					default:
						console.log("Unknown event!");
						console.log(message);
						break;
				}
			});
		}else{
			console.error(body);
		}
	});
}

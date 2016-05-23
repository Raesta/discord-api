var Core = require('./libs/core');
var Channel = require('./libs/channel');
var Guild = require('./libs/guild');
var User = require('./libs/user');
var Invite = require('./libs/invite');
var Voice = require('./libs/voice');

module.exports = Discord;

function Discord() {

}

Discord.prototype.core = new Core();

Discord.prototype.channel = new Channel();

Discord.prototype.guild = new Guild();

Discord.prototype.user = new User();

Discord.prototype.invite = new Invite();

Discord.prototype.voice = new Voice();

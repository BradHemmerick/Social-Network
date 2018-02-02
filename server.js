const Hapi = require('hapi');
const server = new Hapi.Server();
const mongoose = require('mongoose')

const User = require('./database_models/user_model');
const node_connect_db = mongoose.connect("mongodb://localhost/node_connect")

server.connection({
	port: 3000
});

server.start(console.log('Server up at port 3000'))

//routes
server.route({
	method: "GET",
	path: '/',
	handler: function (req, reply) {
		reply.view('landing');
	}
})
//set view engine to ejs
server.register(require("vision"), function (err) {
	server.views({
		engines: {
			ejs: require("ejs")
		},
		relativeTo: __dirname,
		path: "views"
	})
});

server.register(require("inert"), function (err) {

});

server.register(require('hapi-auth-cookie'));
server.auth.strategy('simple-cookie-strategy', 'cookie', {
	cookie: 'node_connect_cookie',
	password: "abcdefghabcdefghabcdefghabcdefgh",
	isSecure: false
})

server.register({
	register: require('./routes/user')
}, function(err) {
	if(err){
		return;
	}
});

server.register({
	register: require('./routes/home')
}, function(err){
	if(err){
		return;
	}
})

server.route({
	method: "GET",
	path: "/{param*}",
	handler: {
		directory: {
			path: "public"
		}
	}
});

server.route({
	method: "GET",
	path: "/user_profile_images/{param*}",
	handler: {
		directory: {
			path: "user_profile_images"
		}
	}
})

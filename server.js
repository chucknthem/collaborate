var express = require("express"),
    io = require("socket.io"),
    fs = require('fs');

app = express.createServer();
io = io.listen(app);

app.configure(function() {                          
    app.use("/", express.static(__dirname + "/static"));
});
app.listen(80);

var CollabSession = function(id, leader) {
    this.id = id;
    this.leader = leader;
    this.clients = {};
    if (leader) {
        this.clients[leader.id] = leader;
    }
}

var CollabClient = function(id, session) {
    this.id = id;
    this.sessions = {};
    if (session) {
        this.sessions[session.id] = session;
    }
}

var collab = function() {
    this._sessions = {}; // mapping of sessions to clients.
    this._idIndex = 0;
    this._alphabet = "abcdefghijklmnopqrstuvwxyz";
    this._uuid = function() {
        var id = "";
        for (var i = 0; i < 5; i++) {
            id += Math.floor(Math.random() * this._alphabet.length);
        }
        id += this._idIndex;
        this._idIndex++;
        return id;
    }
}

collab.prototype.createSession = function(opt_sid) {
    opt_sid = opt_sid || this._uuid();
    var leader = new CollabClient(this._uuid());
    var newSession = new CollabSession(opt_sid, leader);
    leader.sessions[newSession.id] = newSession;

    this._sessions[newSession.id] = newSession;
    return newSession;
}

collab.prototype.getSession = function(sid) {
    return this._sessions[sid];
}

collab.prototype.addNewClient = function(session) {
    var newClient = new CollabClient(this._uuid(), session);
    session.clients[newClient.id] = newClient;
    return newClient;
}


var bsocial = new collab();


var server = io.
    of("/bsocial").
    on("connection", function(socket) {
        var session = null;
        var client = null;
        socket.emit("whoareyou?");
        
        socket.on("iam", function(data) {
            session = bsocial.getSession(data.sid);
            var isNew = false;
            if (!session) {
                console.log("creating room: " + data.sid);
                session = bsocial.createSession(data.sid);
                client = session.leader;
                isNew = true;
            } else if (!session.clients[data.cid]) {
                client = bsocial.addNewClient(session);
                console.log("adding client: " + client.id);
                isNew = true;
            } else {
                client = session.clients[data.cid];
            }
            
            socket.join(session.id);
            console.log("joining room: " + session.id);

            if (isNew) {
                socket.emit("youare", {sid: session.id, cid: client.id});
            }
        });

        socket.on("message", function(message) {
            if (session && client) {
                socket.broadcast.to(session.id).emit("message", {cid: client.id, message: message});
            }
        });

        socket.on("mousemove", function(data) {
            if (session && client) {
                socket.broadcast.to(session.id).emit("mousemove", {
                    cid: client.id,
                    x: data.x,
                    y: data.y
                });
            }
        });
    });

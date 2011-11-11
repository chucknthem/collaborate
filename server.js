var app = require('express').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs');

app.listen(80);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var CollabSession = function() {
    this.id = null;
    this.controller = null;
    this.clientIds = {};
};

var collab = (function() {
    var _session = {};
    
    var _idIndex = 0;
    var _alphabet = "abcdefghijklmnopqrstuvwxyz";

    function uuid() {
        var id = [];
        for (var i = 0; i < 5; i++) {
            id[id.length] = Math.floor(Math.random() * _alphabet.length);
        }
        id[id.length] += _idIndex;
        return id.join('');
    }
    
    return {
        startSession: function(cookie) {
            if (cookie)
        }
    }
})();

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
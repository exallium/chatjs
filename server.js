var app = require("http").createServer(handler),
    io = require("socket.io").listen(app),
    url = require("url"),
    fs = require("fs");

var registered = new Array();
var mimes = new Array();
mimes['js'] = 'javascript';
mimes['css'] = 'css';
mimes['html'] = 'html';

function index(res) {
    fs.readFile(__dirname + "/index.html", function(err, data) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(data);
        res.end();
    });
}

function ext(res, pathname, extension) {
    fs.readFile(__dirname + pathname, function(err, data) {
        res.writeHead(200, {"Content-Type": "text/" + mimes[extension] });
        res.write(data);
        res.end();
    });
}

function handler(req, res) {
    var pathname = url.parse(req.url).pathname;
    console.log("Request for " + pathname + " received.");
    var extension = pathname.split(".");

    if (extension.length > 1) {
        console.log("Got extension " + extension[1]);
        ext(res, pathname, extension[1]);
    } else {
        index(res);
    }
}

io.sockets.on("connection", function(socket) {
    registered.push(socket);

    socket.on('send', function(data) {
        for (var i = 0; i < registered.length; i++) {
            if (registered[i].id != this.id) {
                registered[i].emit("recv", data);
            }
        }
    });
});

app.listen(8888);


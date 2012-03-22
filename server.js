var app = require("http").createServer(handler),
    io = require("socket.io").listen(app),
    url = require("url"),
    fs = require("fs");

var registered = new Array();
var mimes = new Array();
mimes['js'] = 'javascript';
mimes['css'] = 'css';
mimes['html'] = 'html';

function load(res, pathname, extension) {
    fs.readFile(__dirname + pathname, function(err, data) {
        if (err) {
            res.writeHead(404);
            return (err);
        }

        res.writeHead(200, {"Content-Type": "text/" + mimes[extension] });
        res.write(data);
        return res.end();
    });
}

function handler(req, res) {
    var pathname = url.parse(req.url).pathname;
    console.log("Request for " + pathname + " received.");

    if (pathname == "/") {
        pathname = "/index.html";
    }
    var extension = pathname.split(".");

    console.log("Got extension " + extension[1]);
    load(res, pathname, extension[1]);
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


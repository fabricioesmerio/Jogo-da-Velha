const restify = require("restify");

const knex = require("knex")({
    client: "mysql",
    connection: {
        host: "127.0.0.1",
        user: "root",
        password: "",
        database: "velha"
    }
});

const server = restify.createServer({
    name: "server",
    version: "1.0.0"
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});

server.get('/all', function(req, res, next) {
    knex('velha').then(dados => {
        res.send(dados);
    }, next);
});

server.post("/save", function (req, res, next) {
    knex('velha')
    .insert(req.body)
    .then(dados => {
        return res.send(dados);
    }, next);
});

server.get('/*', restify.plugins.serveStatic({
        directory: "./dist",
        default: "index.html",
    }));
const
    express = require("express"),
    bodyParser = require('body-parser'),
    app = express(),
    port = 5000,
    {TwingEnvironment, TwingLoaderFilesystem} = require('twing'),
    loader = new TwingLoaderFilesystem('./src/templates'),
    twing = new TwingEnvironment(loader),
    {connection} = require('./mysql/connectionPool'),
    {createUnicorn, updateUnicorn, getAllUnicorns, getUnicornById} = require('./data/unicorn/repository'),
    {getAllOwners} = require('./data/owner/repository')
;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser());

app.get('/', (req, res) => {
    getAllUnicorns(connection, (error, result) => {
        if (error) {
            res.status(500).send(error.sqlMessage);
            return;
        }
        
        twing.render('./main/main.twig', {unicorns: result.rows}).then(output => {
            res.end(output);
        });
    });
});

app.get('/create', (req, res) => {
    getAllOwners(connection, (error, result) => {
        if (error) {
            res.status(500).send(error.sqlMessage);
            return;
        }
        
        twing.render('./form/form.twig', {owners: result.rows, isCreate: true}).then(output => {
            res.end(output);
        });
    });
});

app.post('/insert', (req, res) => {
    console.log(req.body);
    createUnicorn(connection, req.body, error => {
        if (error) {
            res.status(500).send(error.sqlMessage);
            return;
        }

        res.redirect('/');
    });
});

app.get('/edit/:id', (req, res) => {
    getUnicornById(connection, req.params.id, (error, unicorn) => {
        if (error) {
            res.status(500).send(error.sqlMessage);
            return;
        }

        getAllOwners(connection, (error, owners) => {
            if (error) {
                res.status(500).send(error.sqlMessage);
                return;
            }
            
            twing.render('./form/form.twig', {unicorn, owners: owners.rows, isCreate: false}).then(output => {
                res.end(output);
            });
        });
    });
});

app.post('/update/:id', (req, res) => {
    updateUnicorn(connection, {id: req.params.id, ...req.body}, error => {
        if (error) {
            res.status(500).send(error.sqlMessage);
            return;
        }

        res.redirect('/');
    });
});

app.listen(port, () => console.log(
    `API is listening on port ${port} with version ${process.version} :)`
));

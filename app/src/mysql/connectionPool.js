const
    connection = require('mysql').createPool({
        connectionLimit : 100,
        host     : '172.22.0.2',
        user     : 'luminus',
        password : 'luminus',
        database : 'luminus',
        port: 3306,
        debug    :  false,
    })
;

module.exports = {
    connection,
};

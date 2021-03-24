const
    {
        createRecord,
        findRecords,
    } = require('../helpers')
;

function createOwner(connection, owner, callback) {
    createRecord(
        connection,
        'owners',
        owner,
        callback
    );
}

function getAllOwners(connection, callback) {
    findRecords(
        connection,
        `SELECT * FROM owners`,
        null,
        [],
        newOwner,
        callback
    );
}

function newOwner(data) {
    return Object.freeze({
        id: data.id,
        name: data.name,
        email: data.email,
        mobile: data.mobile
    });
}

module.exports = {
    getAllOwners,
    createOwner,
};
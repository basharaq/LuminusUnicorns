const
    {
        createRecord,
        updateRecord,
        findRecords,
        findRecord,
    } = require('../helpers')
;

function createUnicorn(connection, {name, age, color, owner}, callback) {
    createRecord(
        connection,
        'unicorns',
        {name, age, color},
        (error, insertId) => {
            if (!error) {
                while (owner.length > 0) {
                    createRecord(
                        connection,
                        'unicorn_owners',
                        {unicorn_id: insertId, owner_id: owner.pop()},
                        owner.length === 0 && callback
                    )
                }
            }
        }
    );
}

function updateUnicorn(connection, {id, name, age, color, owner}, callback) {
    updateRecord(
        connection,
        'unicorns',
        {name, age, color},
        {id},
        (error) => {
            if (!error) {
                if (!Array.isArray(owner)) {
                    owner = [owner];
                }

                while (owner.length > 0) {
                    updateRecord(
                        connection,
                        'unicorn_owners',
                        {unicorn_id: id, owner_id: owner.pop()},
                        {unicorn_id: id},
                        owner.length === 0 && callback
                    )
                }
            }
        }
    );
}

function getAllUnicorns(connection, callback) {
    const sql = `SELECT
                        unicorns.id,
                        unicorns.name,
                        unicorns.age,
                        unicorns.color,
                        owners.id AS owner_id,
                        owners.name AS owner_name,
                        owners.email AS owner_email,
                        owners.mobile AS owner_mobile
                    FROM unicorns
                    INNER JOIN unicorn_owners on (unicorns.id = unicorn_owners.unicorn_id)
                    INNER JOIN owners on (unicorn_owners.owner_id = owners.id)`;
    if (!callback) {
        return;
    }

    connection.query(sql, (error, result) => {
        const groupedRows = {};

        result.forEach(row => {
            if (!groupedRows[row.id]) {
                groupedRows[row.id] = newUnicorn(row)
            }

            groupedRows[row.id].owners.push(newOwner(row));
        });

        callback(
            error,
            {
                totalCount: Object.keys(groupedRows).length,
                rows: Object.values(groupedRows)
            }
        );
    });
}

function getUnicornById(connection, id, callback) {
    const sql = `SELECT
                        unicorns.id,
                        unicorns.name,
                        unicorns.age,
                        unicorns.color,
                        owners.id AS owner_id,
                        owners.name AS owner_name,
                        owners.email AS owner_email,
                        owners.mobile AS owner_mobile
                    FROM unicorns
                    INNER JOIN unicorn_owners on (unicorns.id = unicorn_owners.unicorn_id)
                    INNER JOIN owners on (unicorn_owners.owner_id = owners.id)
                    WHERE unicorns.id = ?`;

    if (!callback) {
        return;
    }

    connection.query(sql, [id], (error, result) => {
        const unicorn = Object.freeze({
            id: result[0].id,
            name: result[0].name,
            age: result[0].age,
            color: result[0].color,
            owners: {}
        });

        result.forEach(row => {
            unicorn.owners[row.owner_id] = newOwner(row);
        });

        callback(
            error,
            unicorn
        );
    });
}

function newUnicorn(data) {
    return Object.freeze({
        id: data.id,
        name: data.name,
        age: data.age,
        color: data.color,
        owners: []
    });
}

function newOwner(data) {
    return Object.freeze({
        id: data.owner_id,
        name: data.owner_name,
        email: data.owner_email,
        mobile: data.owner_mobile,
    });
}

module.exports = {
    createUnicorn,
    updateUnicorn,
    getAllUnicorns,
    getUnicornById,
};
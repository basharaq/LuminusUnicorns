const
    ItemNotFoundError = require('../errors/itemNotFound')
;

function createRecord(connection, table, params, callback) {
    connection.query(`INSERT INTO ${table} SET ?`, params, (error, result) => {
        if (callback) {
            callback(error, result && result.insertId);
        }
    });
}

function updateRecord(connection, table, params, condition, callback) {
    connection.query(`UPDATE ${table} SET ? WHERE ?`, [params, condition], (error, result) => {
        if (callback) {
            callback(error, result && result.changedRows);
        }
    });
}

function deleteRecord(connection, table, condition, callback) {
    connection.query(`DELETE FROM ${table} WHERE ?`, condition, (error, result) => {
        if (callback) {
            callback(error, result && result.affectedRows);
        }
    });
}

function findRecord(
    connection,
    sql,
    table,
    params,
    entityFactory,
    callback
) {
    if (!callback) {
        return;
    }

    connection.query(sql, params, (error ,result) => {
        if (!error && result.length === 0) {
            error = new ItemNotFoundError(`${table}`);
        }

        callback(
            error,
            (result && result[0]) && entityFactory(result[0])
        );
    });
}

function findRecords(connection, selectSql, totalCountSql, params, entityFactory, callback) {
    if (!callback) {
        return;
    }

    connection.query(selectSql, params, (selectError, selectResult) => {
        const rows = selectResult && selectResult.map(entity => entityFactory(entity))

        if (!totalCountSql) {
            callback(
                selectError,
                {
                    totalCount: rows.length,
                    rows
                }
            );

            return;
        }

        connection.query(totalCountSql, (countError, countResult) => {
            callback(
                selectError || countError,
                {
                    totalCount: countResult && countResult[0].count,
                    rows
                }
            );
        });
    });
}

function recordExists(connection, sql, params, callback) {
    if (!callback) {
        return;
    }

    connection.query(sql, params, (error, result) => {
        callback(
            error,
            result ? result.length > 0 : false
        );
    });
}

module.exports = {
    createRecord,
    updateRecord,
    deleteRecord,
    findRecords,
    findRecord,
    recordExists,
};
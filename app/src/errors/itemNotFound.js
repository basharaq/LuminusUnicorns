class ItemNotFoundError extends Error {
    constructor(description) {
        super("Item not found: " + description);
    }
}

module.exports = ItemNotFoundError;

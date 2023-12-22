class Environment {
    constructor(record = {}) {
        this.record = record
    }
    set(variable, value) {
        this.record[variable] = value
        return value
    }
    lookup(variable) {
        if (!this.record.hasOwnProperty(variable)) {
            throw `VariableNotFound ${variable}`
        }
        return this.record[variable]
    }
}

module.exports = Environment
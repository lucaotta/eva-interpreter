class Environment {
    constructor(record = {}, parent = null) {
        this.record = record
        this.parent = parent
    }
    define(variable, value) {
        this.record[variable] = value
        return value
    }
    assign(variable, value) {
        this.resolve(variable).record[variable] = value
        return value
    }
    lookup(variable) {
        return this.resolve(variable).record[variable]
    }

    resolve(variable) {
        if (this.record.hasOwnProperty(variable)) {
            return this
        }
        if (this.parent)
            return this.resolve(variable)

        throw `VariableNotFound ${variable}`
    }
}

module.exports = Environment
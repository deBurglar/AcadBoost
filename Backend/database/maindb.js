const mongoose = require('mongoose')

console.log(process.env.DATABASE_STRING)
async function main() {
    await mongoose.connect(process.env.DATABASE_STRING)
}

module.exports = main
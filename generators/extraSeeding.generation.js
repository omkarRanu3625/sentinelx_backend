const { faker } = require('@faker-js/faker')
const bcrypt = require('bcrypt')
const User = require('../models/User')


async function createUsers(count = 1000) {
    let users = []
    for (let i = 0; i < count; i++) {
        const _id = faker.database.mongodbObjectId()
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        const name = firstName + " " + lastName
        const username = faker.internet.userName({ firstName, lastName })
        const email = faker.internet.email()
        const password = await bcrypt.hash('12345678', 1)
        const phoneNumber = faker.phone.number().toString()
        const isVerified = faker.datatype.boolean()
        const data = {
            _id,
            name,
            username,
            email,
            phoneNumber,
            password,
            isVerified
        }
        users.push(data)
    }
    return await User.insertMany(users)
}


module.exports = {
    createUsers
}
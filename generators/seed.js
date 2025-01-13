const { connectDB, disconnectDB, dropDatabase } = require("../config/configDB");
const { createUsers } = require("./extraSeeding.generation");

async function seedDB() {
    await connectDB();
    // Delete All Tables
    console.log('Dropping Database')
    await dropDatabase()

    console.log('Seeding Database');
    console.log('Seeding Users');
    await createUsers();
    
    console.log('Database seeded!');

    await disconnectDB()
}

seedDB().catch(err => console.log(err));
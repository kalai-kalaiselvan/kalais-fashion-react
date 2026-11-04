require('dotenv').config();

const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {

    const name = 'Kalai Admin';
    const email = 'admin@kalais.com';
    const password = 'kalai@1517';

    try {

        const hashedPassword = await bcrypt.hash(password, 12);

        await db.promise().query(
            `INSERT INTO users (name, email, password, role)
             VALUES (?, ?, ?, 'admin')`,
            [name, email, hashedPassword]
        );

        console.log('Admin created successfully');

    } catch (error) {

        console.log(error);

    } finally {

        db.end();

    }
}

createAdmin();
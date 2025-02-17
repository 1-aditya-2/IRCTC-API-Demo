import mysql from 'mysql2';
import { configDotenv } from 'dotenv';

configDotenv();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((error, connection) => {
    if (error) {
        console.error('Database connection failed:', error.message);
    } else {
        console.log('Database connected successfully!');
        
        const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS irctc_api;`;
        const useDatabaseQuery = `USE irctc_api;`;
        
        const createUsersTableQuery = `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('user', 'admin') DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;
        
        const createTrainsTableQuery = `CREATE TABLE IF NOT EXISTS trains (
            id INT AUTO_INCREMENT PRIMARY KEY,
            train_number VARCHAR(50) NOT NULL,
            source VARCHAR(255) NOT NULL,
            destination VARCHAR(255) NOT NULL,
            total_seats INT NOT NULL,
            available_seats INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;
        
        const createBookingsTableQuery = `CREATE TABLE IF NOT EXISTS bookings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            train_id INT,
            seats INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (train_id) REFERENCES trains(id)
        );`;

        connection.query(createDatabaseQuery, (err) => {
            if (err) console.error('Error creating database:', err.message);
            else {
                connection.query(useDatabaseQuery, (err) => {
                    if (err) console.error('Error selecting database:', err.message);
                    else {
                        connection.query(createUsersTableQuery, (err) => {
                            if (err) console.error('Error creating users table:', err.message);
                        });
                        connection.query(createTrainsTableQuery, (err) => {
                            if (err) console.error('Error creating trains table:', err.message);
                        });
                        connection.query(createBookingsTableQuery, (err) => {
                            if (err) console.error('Error creating bookings table:', err.message);
                        });
                    }
                });
            }
        });

        connection.release();
    }
});

export default pool.promise();

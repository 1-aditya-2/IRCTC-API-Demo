import pool from '../db/db.conifg.js';

class User {
    constructor(name, email, password, role ='user') {
        this.name = name;
        this .email = email;
        this.password = password;
        this.role = role;
    }

    async save() {
        try {
            const [result] = await pool.query(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [this.name, this.email, this.password, this.role]
            );

            return result;
        } catch (error) {
            throw new Error("Error saving user: ", error.message);
            
        }
    }


    static async findByEmail(email) {
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            return (rows.length > 0) ? rows[0] : null;
        } catch (error) {
            throw new Error("Error fetching user: ", error.message);
        }
    }
}

export default User;
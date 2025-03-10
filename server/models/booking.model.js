import pool from '../db/db.conifg.js';

const Booking = {
    create: async (userId, trainId, seats, connection) => {
        try {
            const query = `
                INSERT INTO bookings (user_id, train_id, seats)
                VALUES (?, ?, ?)
            `;
            const [result] = await connection.query(query, [userId, trainId, seats]);
            return result.insertId; 
        } catch (err) {
            throw new Error('Error creating booking: ' + err.message);
        }
    },
};


export default Booking;
import pool from '../db/db.conifg.js';


export const addTrain = async (trainNumber, source, destination, totalSeats) => {
    const availableSeats = totalSeats; 
    try {
        const [result] = await pool.query(
        'INSERT INTO trains (train_number, source, destination, total_seats, available_seats) VALUES (?, ?, ?, ?, ?)',
        [trainNumber, source, destination, totalSeats, availableSeats]
        );
        return result.insertId; 
    } catch (error) {
        throw new Error('Error adding train data', error);
    }
};


export const getTrainById = async (trainId) => {
    try {
        const [rows] = await pool.query('SELECT * FROM trains WHERE id = ?', [trainId]);
        return rows[0];
    } catch (error) {
        throw new Error('Error fetching train data by Id');
    }
};


export const getTrainsByRoute = async (source, destination) => {
    try {
        const sourceFormatted = source.trim().toLowerCase();
        const destinationFormatted = destination.trim().toLowerCase();

        const [rows] = await pool.query(
        `SELECT train_number, source, destination, total_seats, available_seats 
        FROM trains 
        WHERE TRIM(LOWER(source)) = ? AND TRIM(LOWER(destination)) = ?`,
        [sourceFormatted, destinationFormatted]
        );

        return rows;
    } catch (error) {
        console.error('Error fetching trains by route:', err);
        throw new Error('Error fetching/getting trains by route: ', error.message);
    }
};


export const updateAvailableSeats = async (trainId, seatsToBook) => {
    try {
        const [result] = await pool.query(
        'UPDATE trains SET available_seats = available_seats - ? WHERE id = ? AND available_seats >= ?',
        [seatsToBook, trainId, seatsToBook]
        );
        return result.affectedRows > 0; 
    } catch (error) {
        throw new Error('Error modifying available seats', error.message);
    }
};

export const updateSeats = async (trainId, totalSeats, availableSeats) => {
    try {
        const [result] = await pool.query(
        'UPDATE trains SET total_seats = ?, available_seats = ? WHERE id = ?',
        [totalSeats, availableSeats, trainId]
        );
        return result.affectedRows > 0; 
    } catch (error) {
        throw new Error('Error updating seats in the database: ', error.message);
    }
};
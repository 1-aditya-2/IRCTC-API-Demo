import pool from '../db/db.conifg.js';
import { getTrainsByRoute } from '../models/train.model.js';
import Booking from '../models/booking.model.js';

// Available trains and their seats by source and destination
export const getSeatAvailability = async (req, res) => {
    const { source, destination } = req.query;

    if (!source || !destination) {
        return res.status(400).json({ message: 'Source and destination are required' });
    }

    try {
        const trains = await getTrainsByRoute(source, destination);

        if (!trains.length) {
            return res.status(404).json({ message: 'No trains available for the specified route' });
        }

        const availableTrains = trains.filter(train => train.available_seats > 0)
            .map(({ train_number, available_seats }) => ({ trainNumber: train_number, availableSeats: available_seats }));

        res.status(200).json({
            available: availableTrains.length > 0,
            availableTrainCount: availableTrains.length,
            trains: availableTrains
        });
    } catch (error) {
        console.error('Error fetching seat availability:', error.message);
        res.status(500).json({ message: 'Error fetching seat availability', error: error.message });
    }
};

// Booking seats with transaction & locking mechanism
export const reserveSeat = async (req, res) => {
    const { trainId, seatsToBook } = req.body;
    const userId = req.user.id;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [lockResult] = await connection.query('SELECT GET_LOCK(?, 10)', [`train_lock_${trainId}`]);
        if (!lockResult[0] || lockResult[0][`GET_LOCK('train_lock_${trainId}', 10)`] !== 1) {
            await connection.rollback();
            return res.status(429).json({ message: 'Too many booking attempts, please try again later' });
        }

        const [[train]] = await connection.query(
            'SELECT total_seats, available_seats FROM trains WHERE id = ? FOR UPDATE',
            [trainId]
        );

        if (!train) {
            await connection.rollback();
            return res.status(404).json({ message: 'Train not found' });
        }

        if (train.available_seats < seatsToBook) {
            await connection.rollback();
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        await connection.query(
            'UPDATE trains SET available_seats = available_seats - ? WHERE id = ?',
            [seatsToBook, trainId]
        );

        await Booking.create(userId, trainId, seatsToBook, connection);

        await connection.commit();
        res.json({ message: 'Seats booked successfully' });
    } catch (error) {
        console.error("Error during booking:", error.message);
        await connection.rollback();
        res.status(500).json({ message: 'Error booking seats', error: error.message });
    } finally {
        await connection.query('SELECT RELEASE_LOCK(?)', [`train_lock_${trainId}`]);
        connection.release();
    }
};

// All booking details for a user
export const getBookingDetails = async (req, res) => {
    const userId = req.user.id;

    try {
        const query = `
            SELECT 
                b.id AS booking_id,
                b.seats AS number_of_seats,
                t.train_number,
                t.source,
                t.destination
            FROM bookings b
            JOIN trains t ON b.train_id = t.id
            WHERE b.user_id = ?
        `;

        const [rows] = await pool.query(query, [userId]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching booking details:', error.message);
        res.status(500).json({ message: 'Error fetching booking details' });
    }
};
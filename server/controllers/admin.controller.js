import pool from '../db/db.conifg.js';
import { updateSeats } from '../models/train.model.js';

// Adding trains (Admin Only)
export const addTrain = async (req, res) => {
    let trains = Array.isArray(req.body) ? req.body : [req.body];
    
    if (!trains.length) {
        return res.status(400).json({ message: 'Please provide train data to add!' });
    }

    try {
        const trainIds = await Promise.all(trains.map(async ({ trainNumber, source, destination, totalSeats }) => {
            if (!trainNumber || !source || !destination || totalSeats === undefined) {
                throw new Error('Missing required train data!');
            }

            const [result] = await pool.query(
                'INSERT INTO trains (train_number, source, destination, total_seats, available_seats) VALUES (?, ?, ?, ?, ?)',
                [trainNumber, source, destination, totalSeats, totalSeats]
            );
            return { trainNumber, trainId: result.insertId };
        }));

        res.json({ message: 'Trains added successfully!', trainIds });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error adding trains!' });
    }
};

// Updating train seats (Admin Only)
export const updateTrainSeats = async (req, res) => {
    const { trainId } = req.params;
    const { totalSeats, availableSeats } = req.body;

    if ([totalSeats, availableSeats].some(value => value === undefined)) {
        return res.status(400).json({ message: 'Missing totalSeats or availableSeats!' });
    }

    if (availableSeats > totalSeats) {
        return res.status(400).json({ message: 'Available seats cannot exceed total seats!' });
    }

    try {
        const updated = await updateSeats(trainId, totalSeats, availableSeats);
        return updated
            ? res.status(200).json({ message: 'Seats updated successfully!' })
            : res.status(404).json({ message: 'Train not found or seats not updated!' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating train seats', error: error.message });
    }
};

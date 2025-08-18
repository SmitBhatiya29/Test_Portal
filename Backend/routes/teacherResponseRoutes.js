// routes/teacherResponseRoutes.js
const express = require('express');
const router = express.Router();
const TeacherResponse = require('../models/TeacherResponse');

// GET - fetch all responses for a teacher
router.get('/:teacherId', async (req, res) => {
    try {
        const { teacherId } = req.params;
        const responses = await TeacherResponse.find({ teacherId })
            .sort({ createdAt: -1 });

        res.json(responses);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching teacher responses', details: error.message });
    }
});

module.exports = router;

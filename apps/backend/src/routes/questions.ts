import express from 'express';
import Question from '../models/question';
import requireAuth from '../middlewares/require-auth';

const router = express.Router();

// get questions
router.get('/', async (req, res) => {

    try {

        const questions = await Question.find().populate('author', 'username');

        res.json(questions);

    } catch (error) {

        res.status(500).send(error.message);

    }

});

// add question
router.post('/add', requireAuth, async (req, res) => {

    if (!req.session || !req.session.userId) {

        return res.status(401).send('unauthorized');

    }

    const { questionText } = req.body;

    try {

        const question = new Question({ questionText, author: req.session.userId });

        await question.save();

        res.status(201).send('added questioin successfully');

    } catch (error) {

        res.status(500).send(error.message);

    }

});


// answer and update
router.post('/answer', requireAuth, async (req, res) => {

    if (!req.session || !req.session.userId) {

        return res.status(401).send('unauthorized');

    }

    const { _id, answer } = req.body;

    try {

        const question = await Question.findById(_id).populate('author', 'username');

        if (!question) {

            return res.status(404).send('questoin not found');

        }

        question.answer = answer;

        await question.save();

        const updatedQuestion = await Question.findById(_id).populate('author', 'username');

        res.json(updatedQuestion);

    } catch (error) {

        res.status(500).send(error.message);

    }

});


export default router;

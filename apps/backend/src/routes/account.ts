import express from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import requireAuth from '../middlewares/require-auth';

const router = express.Router();

// signing up
router.post('/signup', async (req, res) => {

    const { username, password } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, password: hashedPassword });

        await user.save();

        res.status(201).send('user created successfully');

    } catch (error) {

        res.status(500).send(error.message);

    }

});

// logging in
router.post('/login', async (req, res) => {

    const { username, password } = req.body;

    try {

        const user = await User.findOne({ username });

        if (user && await bcrypt.compare(password, user.password)) {

            if (req.session) {

                req.session.userId = user._id.toString();

                res.send('you logged in in successfully');

            } else {

                res.status(500).send('session could not be created');

            }

        } else {

            res.status(401).send('credentials invalid');

        }

    } catch (error) {

        res.status(500).send(error.message);

    }
});

// logging out
router.post('/logout', requireAuth, (req, res) => {

    req.session = null;

    res.send('log out success');

});

export default router;

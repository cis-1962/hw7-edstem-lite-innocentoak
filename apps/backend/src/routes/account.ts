import express from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import requireAuth from '../middlewares/require-auth';

const router = express.Router();

// signing up
router.post('/signup', async (req, res) => {

    console.log('got to signup', req.body);

    const { username, password } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, password: hashedPassword });

        await user.save();

        console.log('user created:', user);

        res.status(201).send('user created successfully');

    } catch (error) {

        console.error('could not create user:', error);

        res.status(500).send(error.message);

    }
});

// logging in
router.post('/login', async (req, res) => {

    console.log('got to login', req.body);

    const { username, password } = req.body;

    try {

        const user = await User.findOne({ username });

        console.log('User found:', user);

        if (!user) {

            console.log('login failed: could not find user');

            return res.status(401).json({ message: 'invalid username or password' });

        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {

            if (req.session) {

                req.session.userId = user._id.toString();

                res.json({ message: 'logged in successfully', user: { username: user.username, _id: user._id } });

            } else {

                console.log('could not create session');

                res.status(500).json({ message: 'could not create session' });

            }

        } else {

            console.log('Login failed: incorrect password');

            res.status(401).json({ message: 'invalid username or password' });

        }

    } catch (error) {

        console.error('Login error:', error);

        res.status(500).json({ message: 'error logging in', error: error.message });

    }
});

// logging out
router.post('/logout', requireAuth, (req, res) => {

    req.session = null;

    res.send('log out success');

});

// Check login status
router.get('/status', (req, res) => {

    if (req.session && req.session.userId) {

        User.findById(req.session.userId)
            .select('-password')
            .then(user => {
                if (user) {

                    res.json({ isLoggedIn: true, user: { username: user.username, _id: user._id } });

                } else {

                    res.status(404).json({ isLoggedIn: false, message: 'User not found' });

                }
            })
            .catch(error => {

                console.error('Error fetching user:', error);

                res.status(500).json({ isLoggedIn: false, error: error.message });

            });

    } else {

        res.json({ isLoggedIn: false });

    }

});

export default router;

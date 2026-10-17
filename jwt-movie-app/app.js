
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

// Secret key for signing JWT tokens
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

// Sample registered users
const users = [
    {
        id: 1,
        username: 'john',
        password: 'password123'
    },
    {
        id: 2,
        username: 'alice',
        password: 'alice123'
    }
];

// Premium movie collection
const movies = [
    { id: 1, title: 'Inception', genre: 'Sci-Fi' },
    { id: 2, title: 'Interstellar', genre: 'Sci-Fi' },
    { id: 3, title: 'The Dark Knight', genre: 'Action' }
];

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return res.status(401).json({
            message: 'Invalid username or password'
        });
    }

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username
        },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.status(200).json({
        message: 'Login successful',
        token: token
    });
});

// JWT authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({
            message: 'Access denied. Token is required.'
        });
    }

    const token = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    if (!token) {
        return res.status(401).json({
            message: 'Access denied. Invalid token format.'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: 'Invalid or expired token'
            });
        }

        req.user = decoded;
        next();
    });
}

// Protected route to access premium movies
app.get('/movies', authenticateToken, (req, res) => {
    res.status(200).json({
        message: 'Premium movies retrieved successfully',
        movies: movies
    });
});

// Default route
app.get('/', (req, res) => {
    res.send('JWT Movie Streaming API is running');
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

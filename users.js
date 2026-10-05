const express = require('express');

const app = express();

// Middleware for request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// User data
const users = [
    {
        username: "john",
        role: "admin",
        lastAccessDate: "2026-10-01"
    },
    {
        username: "alice",
        role: "user",
        lastAccessDate: "2026-09-20"
    },
    {
        username: "bob",
        role: "user",
        lastAccessDate: "2026-09-28"
    },
    {
        username: "david",
        role: "manager",
        lastAccessDate: "2026-09-10"
    }
];

// Route to get users who accessed within the last 10 days
app.get('/users', (req, res) => {

    const currentDate = new Date();

    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(currentDate.getDate() - 10);

    const filteredUsers = users.filter(user => {
        const lastAccess = new Date(user.lastAccessDate);

        return lastAccess >= tenDaysAgo && lastAccess <= currentDate;
    });

    res.json(filteredUsers);
});

// Configurable port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

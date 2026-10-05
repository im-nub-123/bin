const express = require('express');

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory car inventory
let cars = [
    { id: 1, name: "BMW" },
    { id: 2, name: "Audi" },
    { id: 3, name: "Mercedes" }
];

// GET /read - Retrieve all cars
app.get('/read', (req, res) => {
    res.json(cars);
});

// POST /insert - Add a new car
app.post('/insert', (req, res) => {
    const { id, name } = req.body;

    const newCar = {
        id: id,
        name: name
    };

    cars.push(newCar);

    res.json(newCar);
});

// PUT /update/:id - Update an existing car
app.put('/update/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;

    const car = cars.find(car => car.id === id);

    if (car) {
        car.name = name;
        res.json(car);
    } else {
        res.status(404).json({ message: "Car not found" });
    }
});

// DELETE /delete/:id - Delete a car
app.delete('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = cars.findIndex(car => car.id === id);

    if (index !== -1) {
        const deletedCar = cars.splice(index, 1);

        res.json(deletedCar[0]);
    } else {
        res.status(404).json({ message: "Car not found" });
    }
});

// Server setup
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

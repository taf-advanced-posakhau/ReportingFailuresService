"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const app = (0, express_1.default)();
const port = 8089;
app.use(express_1.default.json());
app.post('/createEntry', (req, res) => {
    const { entry } = req.body;
    // Handle the entry data as needed
    res.send('Entry created successfully');
});
app.get('/formReport', (req, res) => {
    // Handle the form report logic
    res.status(200).send('OK');
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

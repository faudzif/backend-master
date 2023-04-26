import express from 'express';
import path from 'path';

const app = express();

/* Middleware */

/* Setting up the view engine */
app.set("view engine", "ejs")

app.listen(5000, () => {
    console.log('Server is working');
});

app.get('/', (req, res) => {
    res.render('index', { value: "some value from BE" });
});
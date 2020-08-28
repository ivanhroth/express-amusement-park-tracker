const express = require('express');
const router = require('./routes');
const morgan = require('morgan');

const app = express();

app.set('view engine', 'pug');
app.use(morgan('dev'));
app.use('/', router);

const inDevelopment = process.env.NODE_ENV === "development";
const inProduction = process.env.NODE_ENV === 'production';

app.use((req, res, next) => {
    let error = new Error("The requested page couldn't be found.");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    if(inDevelopment){
        console.error(error);
    }
    next(error);
});

app.use((error, req, res, next) => {
    if(error.status === 404) {
        res.status(404);
        res.render('page-not-found', { title: 'Page Not Found' });
    }
    else next(error);
});

app.use((error, req, res, next) => {
    if (error.status) res.status = error.status;
    else res.status(500);
    if (!inProduction) res.render('error', { title: "Server Error", message: error.message, stack: error.stack });
    else res.render('error', { title: "Server Error", message: null, stack: null });
});

module.exports = app;

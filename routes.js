const express = require('express');
const db = require('./db/models');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'Home' })
})

if (process.env.NODE_ENV !== "production") {
    router.get("/error-test", () => {
      throw new Error("This is a test error.");
    });
}

const asyncHandler = (handler) => {
    return (req, res, next) => {
        return handler(req, res, next).catch(next);
    }
}

router.get('/parks', asyncHandler(async (req, res) => {
    let parks = await db.Park.findAll({ order: [['parkName', 'ASC']] });
    res.render('park-list', { title: 'Parks', parks })
}))

module.exports = router;

const express = require('express');
const db = require('./db/models');
const router = express.Router();
const csrf = require('csurf');
const { check, validationResult } = require('express-validator');

const csrfProtection = csrf({ cookie: true });

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
}));

router.get('/park/:id(\\d+)', asyncHandler(async (req, res) => {
    let park = await db.Park.findByPk(req.params.id);
    res.render('park-detail', { title: 'Park Detail', park });
}))

router.get('/park/add', csrfProtection, (req, res) => {
    let park = db.Park.build();
    res.render('park-add', { title: 'Add Park', csrfToken: req.csrfToken(), errors:[], park });
})

router.post('/park/add', csrfProtection, [
    check('parkName').exists({ checkFalsy: true }).withMessage("Please provide a value for Park Name").isLength({max: 255}).withMessage("Park Name must not be more than 255 characters long"),
    check('city').exists({ checkFalsy: true }).withMessage("Please provide a value for City").isLength({max: 100}).withMessage("City must not be more than 100 characters long"),
    check('provinceState').exists({ checkFalsy: true }).withMessage("Please provide a value for Province/State").isLength({max: 100}).withMessage("Province/State must not be more than 100 characters long"),
    check('country').exists({ checkFalsy: true }).withMessage('Please provide a value for Country').isLength({max: 100}).withMessage("Country must not be more than 100 characters long"),
    check('opened').isDate().withMessage('Please provide a valid date for Opened').exists({ checkFalsy: true }).withMessage('Please provide a value for Opened'),
    check('size').exists({ checkFalsy: true }).withMessage('Please provide a value for Size').isLength({max: 100}).withMessage('Size must not be more than 100 characters long'),
    check('description').exists({ checkFalsy: true }).withMessage('Please provide a value for Description')
],
asyncHandler(async(req, res) => {
    const { parkName, city, provinceState, country, opened, size, description } = req.body;
    const validatorErrors = validationResult(req)
    let park = db.Park.build({ parkName, city, provinceState, country, opened, size, description });
    if (validatorErrors.isEmpty()) {
        await park.save();
        res.redirect('/')
    } else {
        const errors = validatorErrors.array().map(error => error.msg)
        res.render('park-add', { title: 'Add Park', park, errors, csrfToken: req.csrfToken() })
    }

}))

module.exports = router;

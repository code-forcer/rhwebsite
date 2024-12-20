const express = require('express');
const router = express.Router();

// Home Page Route
router.get('/', (req, res) => {
    res.render('pages/', { title: 'Rejoice & Hope | Welcome 📚' });
});

module.exports = router;

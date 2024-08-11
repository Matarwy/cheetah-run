const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

router.post('/addTokens', tokenController.addTokens);
router.get('/getTokens/:userId', tokenController.getTokens);

module.exports = router;

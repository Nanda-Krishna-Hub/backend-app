const express = require('express')
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');


const app = express();
app.use(express.json());

const router  = express.Router();
router.post('/register', rateLimiter, authController.register);
// console.log("Login handler:", authController.login);
router.post('/login', rateLimiter, authController.login);

router.post('/logout', auth, authController.logout)

module.exports = router
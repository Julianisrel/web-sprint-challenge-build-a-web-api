const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).json({
      message: "Welcome to the Sprint Challenge!",
      environmental: `And by the way, ${process.env.WELCOME}`
  })
})

module.exports = router;

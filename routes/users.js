const express = require('express'),
      router = express.Router();

router.get('/', (req,res)=> {
    res.send('Hello from users route')
})

module.exports = router
const express = require('express')
const router = express.Router();
const fs = require('fs');

router.get('/counter', async (req, res)=>{
    const json = fs.readFileSync('count.json', 'utf-8');
    const obj = JSON.parse(json);

    obj.visits = obj.visits+1;

    const newJSON = JSON.stringify(obj);

    fs.writeFileSync('count.json', newJSON);

    res.send(newJSON);
});

module.exports = router;
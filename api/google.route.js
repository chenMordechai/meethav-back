const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const googleKey = 'AIzaSyDg8EFZZ2HBS2X6aqRzwRwfEbPO9SJLPfc'
const axios = require('axios');
// var axios = Axios.create({
    //     withCredentials: true
    // });

module.exports = router

router.get('/getPos', async(req, res) => {
    const pos = req.query;
    var placesResult = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${pos.lat},${pos.lng}&radius=2000&type=park&keyword=dog&key=${googleKey}`)
    res.json(placesResult.data.results)
})

router.get('/getDistance', async(req, res) => {
    const distance = req.query;
    var placesResult = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${distance.dist}&destinations=${distance.userdist}&key=${googleKey}`)
    res.json(placesResult.data.rows[0])
})

// router.get('/getImg', async(req, res) => {
//     const imgRef = req.query;
//     console.log(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imgRef.imgRef}&key=${googleKey}`)
//     var placesResult = await axios.get(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imgRef.imgRef}&key=${googleKey}`)
//         // console.log('placesResult.data',placesResult.data)
//     res.send(placesResult)
// })


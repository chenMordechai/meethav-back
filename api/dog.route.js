const dogService = require('../services/dog.service.js')
const express = require('express')
const router = express.Router()

module.exports = router

function requireAuth(req, res, next) {
    const user = req.session.loggedinUser
    if (!user) return res.status(401).send('Unauthenticated');
    next();
}

function requireAdmin(req, res, next) {
    // const user = req.session.loggedinUser
    // if (!user) return res.status(401).send('Unauthenticated');
    // if (user.isAdmin===false) return res.status(403).send('UnPrivileged');
    next();
}

//dogs List
router.get('/', (req, res) => {
    const filterBy = req.query
    dogService.query(filterBy)
        .then(dogs => {
            res.json(dogs)
        })
})


// dog Single
router.get('/:id', (req, res) => {
    const dogId = req.params.id
    dogService.getById(dogId)
        .then(dog => res.json(dog))
        .catch(() => {
            res.status(404).send('UNKNOWN dog')
        })
})




// dog Delete

router.delete('/:id', requireAdmin, (req, res) => {
    const dogId = req.params.id
    dogService.remove(dogId)
        .then(() => {
            res.json({})
        })
        .catch(() => {
            res.status(500).send('Could Not Delete')
        })
})

// dog Edit

router.put('/edit/:id', requireAuth, (req, res) => {
    const dog = req.body;
    dogService.update(dog)
        .then(dog => res.json(dog))
        .catch(() => {
            res.status(500).send('Could Not Edit')
        })
})

// dog Add

router.post('/add', requireAuth, (req, res) => {
    const dog = req.body;
    dogService.add(dog)
        .then(dogWithId => res.json(dogWithId))
        .catch(() => {
            res.status(500).send('Could Not Add')
        })
})

//send friend request and recieve the request

router.put('/sendFriendReq', requireAuth, (req, res) => {
    const dogId = req.body.dogId;
    const user = req.body.user
    dogService.updateFriendReq(user, dogId)
        .then(dogId => res.json(dogId))
        .catch(() => {
            res.status(500).send('Could Not send and recieve request')
        })
})

//add like
router.put('/addLike', requireAuth, (req, res) => {
    const dogId = req.body.dogId;
    const user = req.body.user
    dogService.updateLikes(user, dogId)
        .then(dogId => res.json(dogId))
        .catch(() => {
            res.status(500).send('Could Not Like')
        })
})



//make friendship 

router.put('/makeFriendship', requireAuth, (req, res) => {
    const dog = req.body.dog;
    const user = req.body.user
    dogService.makeFriendShip(user, dog)
        .then(dog => res.json(dog))
        .catch(() => {
            res.status(500).send('Could Not makeFriendShip')
        })
})

// reject friendship

router.put('/rejectFriendship', requireAuth, (req, res) => {
    const dog = req.body.dog;
    const user = req.body.user
    dogService.rejectFriendShip(user, dog)
        .then(dog => res.json(dog))
        .catch(() => {
            res.status(500).send('Could Not makeFriendShip')
        })
})

//remove frirndship

router.put('/removeFriendship', requireAuth, (req, res) => {
    const dogId = req.body.dogId;
    const user = req.body.user
    dogService.removeFriendShip(user, dogId)
        .then(dog => res.json(dog))
        .catch(() => {
            res.status(500).send('Could Not makeFriendShip')
        })
})




//login

router.post('/', (req, res) => {
    const user = req.body;
    return dogService.logIn(user)
        .then(currUser => {
            req.session.loggedinUser = currUser[0]
            res.json(currUser)
        })
        .catch(err => {
            console.log('cant login in route', err);
            res.status(404).send()
        })
})

//signup
router.post('/signup', (req, res) => {
    const user = req.body;
    dogService.add(user)
        .then(userWithId => res.json(userWithId))
        .catch(err => {
            // console.log('error i s',err);
            res.status(401).send('Not Authorized')
        })
})

//logout
router.post('/logout', requireAuth, (req, res) => {
    req.session.destroy();
    res.end()
})
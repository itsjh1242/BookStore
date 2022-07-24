var express = require('express');
var router = express.Router();


const indexController = require('../controllers/indexController');

//  index info
// router.get('/', function(req, res, next) {
//     indexController.getAllIndex((rows) => {
//         res.render('index', {rows : rows});
//     });
// });

// post index
// router.post('/postIndex', function(req, res, next){
//     let param = JSON.parse(JSON.stringify(req.body));
//     indexController.postIndexValue(
//         param['id'],
//         param['pw'],
//         param['email'],
//         param['name'],
//         param['contact'], () => {
//             res.redirect('/');
//         }
//     );
// });

// Main Page
router.get('/', function(req, res, next){
    res.render('');
})

module.exports = router;

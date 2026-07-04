const express = require('express');
const authController = require("../controllers/auth.controller");
const { auth, authorize,theatreOwnerCheck,showOwnerCheck,} = require("../middlewares/auth.middleware");
const buildController = require("../controllers/build.controller");
const router = express.Router();

//GET APIs
router.get('/mytheatres',auth,authorize("owner"), buildController.getMyTheatres);
router.get('/theatre/:theatreId', auth, authorize("owner"), theatreOwnerCheck, buildController.getTheatreById);
router.get('/screens/:theatreId', auth, authorize("owner"), theatreOwnerCheck, buildController.getScreens);
router.get("/screens/:theatreId/:screenId", auth, authorize("owner"), theatreOwnerCheck, buildController.getScreenById);
router.get('/shows/:screenId', auth, authorize("owner"),  buildController.getShows);
router.get('/show/:showId', auth, authorize("owner"), showOwnerCheck, buildController.getShowById);
router.get('/dashboard', auth, authorize("owner"), buildController.getDashboard);


// build APIs
router.post('/createthreatre', auth, authorize("owner"), buildController.createTheatre);
router.put('/updatethreatre/:theatreId', auth, authorize("owner"), theatreOwnerCheck, buildController.updateTheatre);
router.delete('/deletethreatre/:theatreId', auth, authorize("owner"),theatreOwnerCheck, buildController.deleteTheatre);
router.post('/createscreen/:theatreId', auth, authorize("owner"),theatreOwnerCheck, buildController.createScreen);
router.put('/updatescreen/:theatreId/:screenId', auth, authorize("owner"), theatreOwnerCheck, buildController.updateScreen);
router.delete('/deletescreen/:theatreId/:screenId', auth, authorize("owner"), theatreOwnerCheck, buildController.deleteScreen);
router.post('/createshow/:theatreId/:screenId', auth, authorize("owner"), theatreOwnerCheck, buildController.createShow);
router.put('/updateshow/:showId', auth, authorize("owner"),showOwnerCheck, buildController.updateShow);
router.delete('/deleteshow/:showId', auth, authorize("owner"), showOwnerCheck, buildController.deleteShow);
module.exports = router;


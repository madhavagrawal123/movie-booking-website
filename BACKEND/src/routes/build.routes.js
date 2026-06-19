const express = require('express');
const authController = require("../controllers/auth.controller");
const { auth, authorize,theatreOwnerCheck } = require("../middlewares/auth.middleware");
const buildController = require("../controllers/build.controller");
const router = express.Router();


// build APIs
router.post('/createthreatre', auth, authorize("owner"), buildController.createTheatre);
router.put('/updatethreatre/:theatreId', auth, authorize("owner"), theatreOwnerCheck, buildController.updateTheatre);
router.delete('/deletethreatre/:theatreId', auth, authorize("owner"),theatreOwnerCheck, buildController.deleteTheatre);
router.post('/createscreen/:theatreId', auth, authorize("owner"),theatreOwnerCheck, buildController.createScreen);
router.put('/updatescreen/:theatreId/:screenId', auth, authorize("owner"), theatreOwnerCheck, buildController.updateScreen);
router.delete('/deletescreen/:theatreId/:screenId', auth, authorize("owner"), theatreOwnerCheck, buildController.deleteScreen);
router.post('/createshow/:theatreId/:screenId', auth, authorize("owner"), theatreOwnerCheck, buildController.createShow);
router.put('/updateshow/:showId', auth, authorize("owner"), buildController.updateShow);
router.delete('/deleteshow/:showId', auth, authorize("owner"), theatreOwnerCheck, buildController.deleteShow);
module.exports = router;
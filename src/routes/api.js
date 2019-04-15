const app = require('express');
const router = app.Router();
const parserController = require('../controllers/parserController');

router.get('/', parserController.welcome);
router.get('/parse', parserController.parse);
router.get('/snapshots', parserController.getSnapshots);
router.get('/snapshots/:id', parserController.viewSnapshot);
router.get('/snapshots/:id/file/:path', parserController.viewFile);

module.exports = router;
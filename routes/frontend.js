const express = require('express');
const router = express.Router();
const loadCommonData = require('../middleware/loadCommonData');
// router.use(loadCommonData);  
const siteController = require('../controllers/siteController');

router.get('/', siteController.index);
router.get('/category/:name', siteController.articleByCategory);
router.get('/search', siteController.search);
router.get('/author/:name', siteController.author);
router.get('/single/:id', siteController.singleArticle);
router.post('/single/:id/comment', siteController.addComment);

router.use((req, res, next) => {
res.status(404).render('404', {message: 'Page Not Found', });
});

router.use((err, req, res,next) => {
    console.error(err.stack);
    res.status(500).render('admin/500', { role: req.role, message: "Internal Server Error" });
    next();
}   );
module.exports = router;

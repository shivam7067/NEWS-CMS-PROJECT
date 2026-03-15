const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const categoryController = require('../controllers/categoryConroller');
const articleController = require('../controllers/articleController');
const commentController = require('../controllers/commentController');
const upload = require('../middleware/multer');
const isLoggedIn = require('../middleware/isLoggedin');   
const isAdmin = require('../middleware/isAdmin');
const isvalid = require('../middleware/validation');

//login routes
router.get('/',userController.loginpage);
router.post('/index',isvalid.loginValidation,userController.adminLogin);
router.get('/logout',userController.logout);
router.get('/dashboard',isLoggedIn,userController. dashboard);
router.get('/settings',isLoggedIn,isAdmin,userController. settings);
router.post('/save-settings',isLoggedIn,isAdmin,upload.single('website_logo'),userController. savesettings);

//user management routes
router.get('/users',isLoggedIn,isAdmin,userController.allUsers);
router.get('/add-user',isLoggedIn,isAdmin,userController.addUserPage);
router.post('/add-user',isvalid.userValidation, isLoggedIn,isAdmin,userController.addUser);
router.get('/update-user/:id',isLoggedIn,isAdmin,userController.updateUserPage);
router.post('/update-user/:id',isvalid.userUpdateValidation, isLoggedIn,isAdmin,userController.updateUser);
router.get('/delete-user/:id',isLoggedIn,isAdmin,userController.deleteUser);

//category management routes
router.get('/category',isLoggedIn,isAdmin,categoryController.allCategories);
router.get('/add-category',isLoggedIn,isAdmin,categoryController.addCategoryPage);
router.post('/add-category',isvalid.categoryValidation, isLoggedIn,isAdmin,categoryController.addCategory);
router.get('/update-category/:id',isLoggedIn,isAdmin,categoryController.updateCategoryPage);
router.post('/update-category/:id',isvalid.categoryValidation, isLoggedIn,isAdmin,categoryController.updateCategory);
router.get('/delete-category/:id',isLoggedIn,isAdmin,categoryController.deleteCategory);

//article management routes
router.get('/article',isLoggedIn,articleController.allArticles);
router.get('/add-article',isLoggedIn,articleController.addArticlePage);
router.post('/add-article', isLoggedIn,upload.single('image'),articleController.addArticle);
router.get('/update-article/:id',isLoggedIn,articleController.updateArticlePage);
router.post('/update-article/:id', isLoggedIn,upload.single('image'),articleController.updateArticle);
router.get('/delete-article/:id',isLoggedIn,articleController.deleteArticle);

//comment management routes
router.get('/comments',isLoggedIn,commentController.allComments);

//404 page
router.use((req, res) => {
    res.status(404).render('admin/404', { role: req.role, message: "Page Not Found" });
});

router.use( isLoggedIn,(err, req, res,next) => {
    console.error(err.stack);
    res.status(500).render('admin/500', { role: req.role, message: "Internal Server Error" });
    next();
}   );

module.exports = router;
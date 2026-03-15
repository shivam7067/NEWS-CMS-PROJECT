const {body} = require('express-validator');

const loginValidation = [
    body('username')
    .notEmpty()
    .withMessage('Username is required')
    .trim()
    .matches(/^\S+$/)
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),

    body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min:4  }).withMessage('Password must be at least 4 characters long')

];

const userValidation = [
    body('fullname')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .trim()
    .isLength({ min: 3 ,max:15}).withMessage('Full name must be at least 3 characters long'),

    body('username')
    .notEmpty()
    .withMessage('Username is required')
    .trim()
    .matches(/^\S+$/)
    .isLength({ min: 3 ,max:15}).withMessage('Username must be at least 3 characters long'),

    body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min:4  }).withMessage('Password must be at least 4 characters long'),

    body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['admin', 'author'])
    .withMessage('Role must be either admin or author')


];

const userUpdateValidation = [
        
   body('fullname')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .trim()
    .isLength({ min: 3 ,max:15}).withMessage('Full name must be at least 3 characters long'),

    body('password')
    
    .optional({ checkFalsy: true })
    .isLength({ min:4  }).withMessage('Password must be at least 4 characters long'),

    body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['admin', 'author'])
    .withMessage('Role must be either admin or author')
]

const categoryValidation = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 3 ,max:15}).withMessage('Category name must be at least 3 characters long'),

    body('description')
    .optional({ checkFalsy: true })
    .isLength({ max: 200 }).withMessage('Description must be less than 200 characters long')
]

const articleValidation = [
    body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1 ,max:100}).withMessage('Title must be at least 1 character long'),

    body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 1 }).withMessage('Content must be at least 10 characters long'),

    body('category')
    .notEmpty()
    .withMessage('Category is required'),

  ]


module.exports = {
    loginValidation,
    userValidation,
    userUpdateValidation,
    categoryValidation,
    articleValidation
}
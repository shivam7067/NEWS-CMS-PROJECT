const category = require('../models/category');
const categoryModel = require('../models/category');
const { validationResult } = require('express-validator');
const newsModel = require('../models/news');

// category management functions
const allCategories = async (req, res,next) => {
    try {
        const category = await categoryModel.find();
        res.render('admin/categories/index', { role: req.role, category,  layout: "admin/layout"});
    } catch (error) {
        next(error);
    }
};

// add category page
const addCategoryPage = async (req, res) => {
    try {
        res.render('admin/categories/create', { role: req.role, errors: 0 , layout: "admin/layout"})
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// add category
const addCategory = async (req, res) => {
        const error=validationResult(req);
    if(!error.isEmpty()){
        return res.render('admin/categories/create', { 
            category: req.body,
            role: req.role,
             errors: error.array()
             })
    }
    try {
        await categoryModel.create(req.body);

        res.redirect('/admin/category')
    }
    catch (error) {
        res.status(500).send('Server Error');
    }
};

//update category Page
const updateCategoryPage = async (req, res,next) => {
     
    try {
        const user = await categoryModel.findById(req.params.id);
        res.render('admin/categories/update', { role: req.role, user, errors: 0 , layout: "admin/layout"});
    } catch (error) {
        next(error);
    }
};

//update category
const updateCategory = async (req, res,next) => {
    const id  = req.params.id;
     const error=validationResult(req);
    if(!error.isEmpty()){
       
        return res.render('admin/categories/update', {category: req.body, role: req.role, errors: error.array() })
    }
    try {
       const category = await categoryModel.findById(id);
        if (!category) {
            return res.status(404).send('Category not found');
        }
        category.name = req.body.name;
        category.description = req.body.description;
        await category.save();
        res.redirect('/admin/category');
    }
 catch (error) {
        next(error);
    }   
 };
       

 //delete category
const deleteCategory = async (req, res,next) => { 
    const { id } = req.params;
    try {
       const category = await categoryModel.findById(id);
        if (!category) {
            return res.status(404).send('Category not found');
        }
        const articles = await newsModel.findOne({ category: id });
        if (articles) {
            return res.status(400).send('Category has associated articles');
        }
        await categoryModel.findByIdAndDelete(id);
        res.redirect('/admin/category');
    }
    catch (error) {
        next(error);
    }
};

module.exports = {
    allCategories,
    addCategoryPage,
    addCategory,
    updateCategoryPage,
    updateCategory,
    deleteCategory
}
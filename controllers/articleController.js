const categoryModel = require('../models/category');
const newsModel = require('../models/news');
const userModel = require('../models/user');
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');



const allArticles = async (req, res, next) => {
    try {
        if (req.role === 'admin') {
            var articles = await newsModel.find().populate('category', 'name').populate('author', 'fullname');
        }
        else {
            var articles = await newsModel.find({ author: req.id }).populate('category', 'name').populate('author', 'fullname');
        }


        res.render('admin/articles/index', { role: req.role, articles , layout: "admin/layout"})
    }
    catch (error) {
        next(error);
    }
};
const addArticlePage = async (req, res, next) => {
    try {
        const category = await categoryModel.find();
        res.render('admin/articles/create', { role: req.role, category, errors: 0 , layout: "admin/layout"})
    }
    catch (error) {
        next(error);
    }
};
const addArticle = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const category = await categoryModel.find();
        return res.render('admin/articles/create', {

            role: req.role,
            category,
            errors: error.array()
        })
    }
    try {
        const { title, content, category } = req.body;

        const author = req.id; // Assuming you have user authentication and userId is available in the request  
        const newArticle = new newsModel({
            title,
            content,
            category,
            image: req.file.filename,
            author
        });
        await newArticle.save();
        res.redirect('/admin/article');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

//update article page
const updateArticlePage = async (req, res, next) => {

    try {
        const article = await newsModel.findById(req.params.id).populate('category', 'name').populate('author', 'fullname');
        if (!article) {
            return res.status(404).send('Article not found');
        }
        if (req.role == 'author') {
            if (req.id != article.author._id) {
                return res.status(403).send('You are not authorized to update this article');
            }
        }
        const category = await categoryModel.find();
        res.render('admin/articles/update', { role: req.role, article, category ,errors: 0, layout: "admin/layout"});
    }
    catch (error) {
        next(error);
    }
};

//update article function
const updateArticle = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const category = await categoryModel.find();
        return res.render('admin/articles/update', {
            article: req.body,
            role: req.role,
            category,
            errors: error.array()
        })
    }
    try {
        const { title, content, category } = req.body;
        const article = await newsModel.findById(req.params.id);
        if (!article) {
            return res.status(404).send("Article not found")
        }
        if (req.role == 'author') {
            if (req.id != article.author._id) {
                return res.status(403).send('You are not authorized to update this article');
            }
        }
        article.title = title;
        article.content = content;
        article.category = category;
        if (req.file) {
            const oldImagePath = path.join(__dirname, '..', 'public', 'uploads', article.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            article.image = req.file.filename;

        }
        await article.save();
        res.redirect('/admin/article');
    } catch (error) {
        next(error);
    }

};

//delete article
const deleteArticle = async (req, res, next) => {
    try {

        const article = await newsModel.findById(req.params.id);
        res.redirect('/admin/article');
        if (!article) {
            return res.status(404).send("Article not found")
        }
        if (req.role == 'author') {
            if (req.id != article.author._id) {
                return res.status(403).send('You are not authorized to delete this article');
            }
        }
        try {
            const imagePath = path.join(__dirname, '..', 'public', 'uploads', article.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        } catch (error) {
            next(error);
        }
        await article.deleteOne();

    }
    catch (error) {
        next(error);
    }

};

module.exports = {
    allArticles,
    addArticlePage,
    addArticle,
    updateArticlePage,
    updateArticle,
    deleteArticle
}
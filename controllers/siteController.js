const mongoose = require('mongoose');
const categoryModel = require('../models/category');
const newsModel = require('../models/news');
const userModel = require('../models/user');
const commentModel = require('../models/comment');
const settingModel = require('../models/setting');
const paginate = require('../utils/pagination');

const index = async (req, res) => {
   try {
    // const news= await newsModel.find()
    // .populate('category',{'name':1,'slug':1})
    // .populate('author','fullname').sort({ createdAt: -1 });

    const paginatedNews = await paginate(newsModel, {}, 
       req.query,{
        populate: [
            { path: 'category', select: { name: 1, slug: 1 } },
            { path: 'author', select: { fullname: 1 } }
        ],
        sort: { createdAt: -1 }
       
    });

   
     // res.json({ paginatedNews });
     res.render('index', {  paginatedNews });
   } catch (error) {
       res.status(500).json({ error: 'An error occurred while fetching data' });
   }
};
const articleByCategory = async (req, res,next) => {

    try {
        const categorySlug = await categoryModel.findOne({ slug: req.params.name });
if (!categorySlug) {
    return res.status(404).send({ error: 'Category not found' });
}   

    //      const news= await newsModel.find({category:categorySlug._id})
    // .populate('category',{'name':1,'slug':1})
    // .populate('author','fullname').sort({ createdAt: -1 });

    const categorriesinUse = await newsModel.distinct('category');
     const categories = await categoryModel.find({ _id: { $in: categorriesinUse } });
    const paginatedNews = await paginate(newsModel, { category: categorySlug._id }, 
       req.query,{
        populate: [
            { path: 'category', select: { name: 1, slug: 1 } },
            { path: 'author', select: { fullname: 1 } }
        ],
        sort: { createdAt: -1 }
       
    });
        res.render('category', { paginatedNews, category: categorySlug.name, categories });
    } catch (error) {
        next(error);
    }
};
const search = async (req, res,next) => {
        try {
            const searchTerm = req.query.search;
    //          const news= await newsModel.find({ 
    //             $or: [
    //                 { title: { $regex: searchTerm, $options: 'i' } },
    //                 { content: { $regex: searchTerm, $options: 'i' } }
    //             ]
    //         })
    // .populate('category',{'name':1,'slug':1})
    // .populate('author','fullname').sort({ createdAt: -1 });

     const categorriesinUse = await newsModel.distinct('category');
    const categories = await categoryModel.find({ _id: { $in: categorriesinUse } });
    const paginatedNews = await paginate(newsModel, { 
    $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { content: { $regex: searchTerm, $options: 'i' } }
    ]
    }, 
       req.query,{
        populate: [
            { path: 'category', select: { name: 1, slug: 1 } },
            { path: 'author', select: { fullname: 1 } }
        ],
        sort: { createdAt: -1 }
       
    });
            res.render('search', {  paginatedNews, searchTerm }   );
        } catch (error) {
            next(error);
        }
};
const author = async (req, res,next) => { 
    try {
        const authorName = await userModel.findOne({ _id: req.params.name });
if (!authorName) {
    return res.status(404).send({ error: 'Author not found' });
}
    //      const news= await newsModel.find({author:req.params.name})
    // .populate('category',{'name':1,'slug':1})
    // .populate('author','fullname').sort({ createdAt: -1 });
// res.json(news);
    // const categoriesinUse = await newsModel.distinct('category');
    // const categories = await categoryModel.find({ _id: { $in: categoriesinUse } });

   const paginatedNews = await paginate(newsModel, {author  : req.params.name}, 
       req.query,{
        populate: [
            { path: 'category', select: { name: 1, slug: 1 } },
            { path: 'author', select: { fullname: 1 } }
        ],
        sort: { createdAt: -1 }
       
    }); 
       res.render('author', { paginatedNews, authorName });
    } catch (error) {
        next(error);
    }
};
const singleArticle = async (req, res,next) => {
    try {
         const singlenews= await newsModel.findById(req.params.id)
    .populate('category',{'name':1,'slug':1})
    .populate('author','fullname').sort({ createdAt: -1 });

    const categoriesinUse = await newsModel.distinct('category');
    const categories = await categoryModel.find({ _id: { $in: categoriesinUse } });
   const comments = await commentModel.find({ article:new mongoose.Types.ObjectId(req.params.id), status: 'approved' }).sort( '-createdAt');
        //  res.json({ singlenews, categories, comments });
       res.render('single', { singlenews, categories, comments });
    } catch (error) {
        next(error);
    }
};
const addComment = async (req, res,next) => {
    try {
            const newsId = req.params.id;
            const { name, email, content } = req.body;
            const comment = new commentModel({
                article: newsId,
                name,
                email,
                content
            });
            await comment.save();
            res.redirect(`/single/${newsId}`);
    } catch (error) {
        next(error);
    }
};


module.exports = {
    index,
    articleByCategory,
    search,
    author,
    singleArticle,
    addComment
}
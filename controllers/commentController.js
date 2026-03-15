const commentModel = require('../models/comment');
const newsModel = require('../models/news');

// comment management functions
const allComments = async (req, res,next) => {
    try {
        let comments;
     if (req.role == 'admin') {
         comments = await commentModel.find().populate('article', 'title').sort({ createdAt: -1 });}
        else {
            const userNews = await newsModel.find({ author: req.userId }).select('_id');
            const newsIds = userNews.map(news => news._id);
            
            comments = await commentModel.find({ article: { $in: newsIds }, status: 'pending' }).populate('article', 'title').sort({ createdAt: -1 });
        }
        res.render('admin/comments/index', { role: req.role, comments, layout: "admin/layout" })

    } catch (error) {
        next(error);
    }
};

module.exports = {
    allComments
}
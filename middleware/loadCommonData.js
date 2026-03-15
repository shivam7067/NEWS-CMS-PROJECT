const categoryModel = require('../models/category');
const newsModel = require('../models/news');
const userModel = require('../models/user');
const commentModel = require('../models/comment');
const settingModel = require('../models/setting');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

const loadCommonData = async (req, res, next) => {
    try {

        let latestNews = cache.get('latestNewsCache');
        let categories = cache.get('categoriesCache');
        let setting = cache.get('settingCache');

        if (!latestNews || !categories || !setting) {

            setting = await settingModel.findOne().lean();

            latestNews = await newsModel.find()
                .populate('category', 'name slug')
                .populate('author', 'fullname')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean();

            const categoriesInUse = await newsModel.distinct('category');

            categories = await categoryModel
                .find({ _id: { $in: categoriesInUse } })
                .lean();

            cache.set('latestNewsCache', latestNews);
            cache.set('categoriesCache', categories);
            cache.set('settingCache', setting);
        }

        res.locals.setting = setting;
        res.locals.latestNews = latestNews;
        res.locals.categories = categories;

        // 👇 add this
        res.locals.role = req.role;

        next();

    } catch (error) {
        console.error('Error loading common data:', error);
        next(error);
    }
};
exports = module.exports = loadCommonData;
const userModel = require('../models/user');
const categoryModel = require('../models/category');
const newsModel = require('../models/news');
const settingModel = require('../models/setting');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { validationResult } = require('express-validator');


dotenv.config();


// login pge
const loginpage = async (req, res) => {
    try {
        res.render('admin/login', {
            layout: false,
            errors: 0
        })
    } catch (error) {
        res.status(500).send('Server Error');
    }
};


// admin login
const adminLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        return res.render('admin/login', {
            layout: false,
            errors: errors.array()
        })
        return;

    }
    const { username, password } = req.body;
    try {
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }
        const jwtdata = { id: user._id, fullname: user.fullname, role: user.role };
        const token = jwt.sign(jwtdata, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxage: 60 * 60 * 1000 });
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// logout function
const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.redirect('/admin');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// dashboard page
const dashboard = async (req, res, next) => {
    try {
        if (req.role === 'admin') {
            var articles = await newsModel.countDocuments();
        } else {
            var articles = await newsModel.countDocuments({ author: req.id });
        }
       
        const users = await userModel.countDocuments();
      
        const categories = await categoryModel.countDocuments();
        res.render('admin/dashboard',{ role: req.role, fullname: req.fullname, articles, users, categories,  layout: "admin/layout"})
    }
    catch (error) {
        next(error);
    }
};

// settings page
const settings = async (req, res, next) => {
    try {
        const setting = await settingModel.findOne();
        res.render('admin/setting', { role: req.role, setting, layout: "admin/layout"})
    } catch (error) {
        next(error);
    }
}
const savesettings = async (req, res, next) => {
    const { website_title, footer_description } = req.body;
    const website_logo = req.file ? req.file.filename : null;
    try {

        let setting = await settingModel.findOne();
        if (!setting) {
            setting = new settingModel({ website_title, footer_description, website_logo });
        } else {
            setting.website_title = website_title;
            setting.footer_description = footer_description;
           
        }
       if(website_logo ){
         if (req.file && setting.website_logo) {
            const logoPath = path.join(__dirname, '..', 'public', 'uploads', setting.website_logo);
            if (fs.existsSync(logoPath)) {
            fs.unlinkSync(logoPath);
        }}
         setting.website_logo = website_logo;
       }
        await setting.save();
        res.redirect('/admin/settings')
    } catch (error) {
        console.error(error);
        next(error);
    }

}

// user management functions
const allUsers = async (req, res, next) => {
    try {
        const users = await userModel.find();
        res.render('admin/users/index', { users, role: req.role , layout: "admin/layout"})
    } catch (error) {
        next(error);
    }
};

// add user page
const addUserPage = async (req, res) => {
    try {
        res.render('admin/users/create', { role: req.role, errors: 0 , layout: "admin/layout"})
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// add user
const addUser = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.render('admin/users/create', { role: req.role, errors: error.array() })
    }
    try {
        await userModel.create(req.body)
        res.redirect('/admin/users')
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// update user page
const updateUserPage = async (req, res, next) => {
    const id = req.params.id;
    try {
        const user = await userModel.findById(req.params.id)
        if (!user) {
            return res.status(404).send('User not found')
        }
        res.render('admin/users/update', { user, role: req.role, errors: 0, layout: "admin/layout" })
    } catch (error) {
        next(error);
    }
}


//Update user
const updateUser = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const user = await userModel.findById(req.params.id)
        return res.render('admin/users/update', { user: req.body, role: req.role, errors: error.array() })
    }
    try {
        await userModel.findByIdAndUpdate(req.params.id, req.body)
        res.redirect('/admin/users')
    } catch (error) {
        next(error);
    }
};

//Delete user
const deleteUser = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.params.id)
        if (!user) {
            return res.status(404).send('User not found')
        }
        const articles = await newsModel.findOne({ author: req.params.id });
        if (articles) {
            return res.status(400).send('user has associated articles');
        }
        await userModel.findByIdAndDelete(req.params.id);
        res.redirect('/admin/users')
    } catch (error) {
        next(error);
    }
};


module.exports = {
    loginpage,
    adminLogin,
    logout,
    dashboard,
    savesettings,
    settings,
    allUsers,
    addUserPage,
    addUser,
    updateUserPage,
    updateUser,
    deleteUser,
}
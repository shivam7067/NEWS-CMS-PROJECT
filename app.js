const express= require("express");
const app = express();
const mongoose = require("mongoose");
const expresslayout = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const cookie= require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");
const minifyHTML = require("express-minify-html-terser");
dotenv.config();
const compression = require("compression");
const loadCommonData=require("./middleware/loadCommonData")

//middilewares
app.use(loadCommonData)
app.use(expresslayout);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());
app.use(express.static(path.join(__dirname, "public"),{ maxAge: '60m' }));
app.set("view engine", "ejs");
app.set('layout','layout');
app.use(compression(
    {
        level: 9, // Compression level (0-9)
        threshold:10* 1024, // Minimum response size in bytes to compress
    }
));


app.use(minifyHTML({
  override:      true,
  exception_url: false,
  htmlMinifier: {
    collapseWhitespace: true,
    removeComments: true,
    collapseBooleanAttributes: true,
    removeEmptyAttributes: true,
    minifyJS: true,
    removeAttributeQuotes: true,
}
}));

//mongoose connection
mongoose.connect(process.env.MONGODB_URI)


 
// routes


app.use("/admin", (req, res, next) => {
    res.locals.layout = "admin/layout";
    next();
});
app.use("/", (req, res, next) => {
    res.locals.layout = "layout";
    next();
});
app.use("/admin",require('./routes/admin'));

app.use('/', require('./routes/frontend'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

})

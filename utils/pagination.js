const { query } = require("express-validator");

const paginate = async (model, query={},reqQuery={},options={}) => {
const { page = 1, limit = 5,sort='-createdAt' } = reqQuery;
const paginateOptions = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sort,
    ...options
}
try {
    const result = await model.paginate(query, paginateOptions);
    return {
        docs: result.docs,
        totalDocs: result.totalDocs,
        limit: result.limit,    
        totalPages: result.totalPages,
        page: result.page,
        pagingCounter: result.pagingCounter,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage
    
    };  
} catch (error) {
    console.error('Pagination error:', error.message);
    throw error;
}
}
module.exports = paginate;
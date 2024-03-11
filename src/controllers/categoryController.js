const categoryModel = require("../models/category")

// ******************** add *************************
async function add_category(category_data) {
    let new_category = await categoryModel.create(category_data)
    return new_category
}
async function get_Image_for_category(file) {
    let pathLink = "http://localhost:5000/" + file.filename;
    return pathLink;
}
// ******************** get category Data *************************
async function getcategoryByID(id) {
    let category = await categoryModel.findOne({ _id: id });
    return category;
}
async function getAll() {
    let categories = await categoryModel.find()
    return categories
}



module.exports = {
    getAll,
    getcategoryByID,
    add_category,
    get_Image_for_category,
}








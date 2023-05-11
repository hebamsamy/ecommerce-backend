const productModel = require("../models/product")

// ******************** Update *************************
async function update_product_allData (id,newData){
    let updated_product_allData = await productModel.updateOne({_id:id},newData)
    return updated_product_allData ;
}
// ******************** check_if_product_exist *************************
async function check_if_product_exist (id){
    let response = await productModel.findById(id)
    return response;
}
// ******************** add *************************
async function add_product (product_data){
    let new_product = await productModel.create(product_data)
    return new_product
}
async function get_Image_for_product(file){
    let pathLink = "http://localhost:5000/"+file.filename;
    return pathLink;
}
// ******************** get product Data *************************

async function getproductByID (id) {
    let product = await productModel.findOne({ _id: id });
    return product;
}
async function getproductByCategoryID (id) {
    let products = await productModel.find({categoryID:id})
    return products
}
async function getAll () {
    let products = await productModel.find()
    return products
}



module.exports={
 getAll,
 check_if_product_exist,
    update_product_allData,
    getproductByID,
    getproductByCategoryID,
    add_product,
    get_Image_for_product
}








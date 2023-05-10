const userModel = require("../models/user")

// ******************** Update *************************
async function update_user_allData (id,newData){
//{f_name:f_name,l_name:l_name}
    let updated_user_allData = await userModel.updateOne({_id:id},newData)
    return updated_user_allData ;
}
// ******************** check_if_email_exist *************************
async function check_if_email_exist (email){
    email=email.toLowerCase();
    let response = await userModel.findOne({email:email})
    return response;
}

// ******************** Register *************************

async function register_new_user (user_data){
    user_data.email=user_data.email.toLowerCase();
    let new_user = await userModel.create(user_data)
    return new_user
}
// ******************** get User Data *************************

async function getUserByEmail (email){
    email=email.toLowerCase();
    let existed_user_data = await userModel.findOne({email:email})
    return existed_user_data;    
}
async function getUserByID (id) {
    let user = await userModel.findOne({ _id: id });
    return user;
}
async function getAllClients(){
    let users = await userModel.find()
    return users
}


module.exports={
    check_if_email_exist ,
    register_new_user,
    update_user_allData,
    getAllClients,
    getUserByEmail,
    getUserByID,
}








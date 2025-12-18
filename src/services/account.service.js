const { default: AccountModel } = require("../models/accountModel");
const { default: StorageModel } = require("../models/storageModel");

exports.save = async (info) => {
    try{
        const user = await AccountModel.create({...info});
        if(user){
            // create the user storage space
            const store = await StorageModel.create({
                account: user._id,
            })
            if(!store) {
                AccountModel.findByIdAndDelete(user._id);
                return {error: "Error creating user storage space"};
            }
        }
        return user;
    } catch (error) {
        return {error:error.message};
    }
}
exports.findByEmail = async (email) => {
    try{
        return AccountModel.findOne({email});
    } catch (error) {
        return {error:error.message};
    }
}
exports.saveRefreshToken = async (accountId, refreshToken) => {
    try { 
        return AccountModel.findByIdAndUpdate(
        accountId,
            {$set: {refreshToken: refreshToken}}
        )
    } catch (error) {
        return {error: error.message}
    }
}

exports.findByRefreshToken = async (refreshToken) => {
    try {
        return AccountModel.findOne({refreshToken:refreshToken})
    } catch (error) {
        
    }
}
exports.findByAccountId = async (AccountId ) => {
    try {
        return AccountModel.findOne({AccountId })
    } catch (error) {
        return{ error : error.message}
    }
}
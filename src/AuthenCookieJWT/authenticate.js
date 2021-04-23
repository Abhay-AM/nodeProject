const jwt = require("jsonwebtoken");
const ModelData = require("../Models/model");
console.log("authentication connection successfully");

const auth = async (req,res,next)=>{
    try {
         const token =  req.cookies.jwt;
         console.log("autho token : "+token);
         const verifyUser = await  jwt.verify(token,process.env.SECRET_KEY); //verify the  token 
         console.log(verifyUser);

        const userId = await ModelData.findOne({_id:verifyUser._id}); //finding the same user Id to genrating the same token
        console.log(userId);
        
        req.token = token;
        req.userId = userId;
        next();

    } catch (error) {
        res.status(401);
        res.send(error);
    }
}

module.exports=auth;
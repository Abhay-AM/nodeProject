const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const schemaData = new  mongoose.Schema({
        firstname:{
            type:String,
            required:true
        },
        lastname:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        gender:{
            type:String,
            required:true
        },
        phone:{
            type:Number,
            required:true,
            unique:true
        },
        age:{
            type:Number,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        confirmpassword:{
            type:String,
            required:true
        },
        tokens:[{
            token:{
                type:String,
                require:true
            }
        }]

});
            //generating the token
         schemaData.methods.generateAuthoToken = async function(req,res){
             try {  
                    console.log(this._id);
                    // const token = await  jwt.sign({_id:this._id.toString()},"mynameisabhayrameshmoonpursuingmybachlerdegreeininformationtechnology");
                    const token = await  jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY); // dotenv (.env ) package is import
                    console.log("this is the token = "+token); 
                    this.tokens = this.tokens.concat({token});
                    await this.save();
                    return token;

             } catch (error) {
                 res.send("this is the error part = "+error);
                 console.log("this is the error part"+error);
             }
         }         

        // password security
schemaData.pre("save",async  function(next) {
    if((this.isModified("password"))){
        console.log(`this is the password ${this.password}`);
    this.password = await  bcrypt.hash(this.password,12);
    console.log(`this is the password in hash form ${this.password}`);

        // confirmpassword create default
        this.confirmpassword = await bcrypt.hash(this.confirmpassword,12);

    }
    
    next();
    
})


// creating a model (model means collections)
const ModelData = new mongoose.model("ModelData",schemaData);
console.log("model connection is successfully");
console.log( "secret key = " +process.env.SECRET_KEY);
module.exports = ModelData;

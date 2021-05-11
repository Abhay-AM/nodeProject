require('dotenv').config({path:"../.env"})
const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcryptjs");
const hbs = require("hbs");
var cookieParser = require('cookie-parser') // cookie-parser
const port = process.env.PORT || 4000;
require("./Database/database");
const ModelData = require("./Models/model");// collections
const auth = require("./AuthenCookieJWT/authenticate");

//cookie parser 
app.use(cookieParser());
// for database 
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// views engine 
const viewsData = path.join(__dirname, "../TemplatePartials/views");
app.set("view engine","hbs");
app.set("views",viewsData);
app.use(express.static(viewsData));

// partials 
const partialsData = path.join(__dirname,"../TemplatePartials/partials");
hbs.registerPartials(partialsData);

app.get("/",(req,res)=>{
    res.render("index");
});
app.get("/about",(req,res)=>{
    res.render("about");
});
app.get("/weather", auth ,(req,res)=>{
    res.render("weather");
    //   console.log("cookie-parser : "+req.cookie);
});

//logout (logout using a cookie , logout from the perticular device And logout from all devices )
app.get("/logout", auth , async (req,res)=>{
    try {   
            //Logout From all devices
            req.userId.tokens = [];
            //logout from one devices
            // req.userId.tokens = req.userId.tokens.filter((deleteToken)=>{
            //                     return deleteToken.token !== req.token 
            // })
            //logout by using cookie only
            res.clearCookie("jwt");
            console.log("logout successfully");
            await  req.userId.save();
            res.render("login");
    } catch (error) {
        res.status(500);
        res.send(error);
    }
})
app.get("/register",(req,res)=> {
    res.render("register");
});
// create database
app.post("/register",async(req,res)=>{
    try {
        const pass = req.body.password;
        const cpass = req.body.confirmpassword;
        if(pass === cpass){
            const registerData = new ModelData ({
                firstname:req.body.firstname,
                lastname :req.body.lastname,
                email    :req.body.email,
                gender   :req.body.gender,
                phone    :req.body.phone,
                age      :req.body.age,
                password :req.body.password,
                confirmpassword : req.body.confirmpassword
    
    
            });
            // token 
       const  token  = await   registerData.generateAuthoToken();

       // creating a cookie 
      // cookie(Name , Value ,[options])
            res.cookie("jwt" , token , {
                expires : new Date(Date.now() + 1500000) ,
                httpOnly : true,
                // secure : true
            })

        const  registeredData = await  registerData.save();
        res.status(201);
        res.render("index");
        // res.send(registeredData);
        console.log(registeredData)
    
        }
        else {

            res.send("Invalid data");
        }

    } catch (error) {
        res.status(404);
        res.send(error);
    }
   
});
app.get("/login",(req,res)=>{
    res.render("login");
})
// creating a databse login 
app.post("/login",async(req,res)=>{
    try {
        const email = req.body.email;
    const password = req.body.password;
    const findEmail = await  ModelData.findOne({email: email});

    //login password compare
    const loginPassWord =await bcrypt.compare(password , findEmail.password);
    console.log("comapre  "+loginPassWord);

    //Token genration at time of login user
    const  token  = await   findEmail.generateAuthoToken();
        console.log("getting a token : "+token);

        // cookie generate at time of user login 
        res.cookie("jwt",token,{ 
            expires:new Date(Date.now()+1500000),
            httpOnly:true,
            // secure:true
        })

    if(loginPassWord){
        res.status(200);
        res.render("index");
    }else{
        res.send("invalid data");
    }
    console.log(findEmail);
    } catch (error) {
        res.status(400);
        res.send(error);
    }
    
})
// error page creation
app.get("*",(req,res)=>{
    res.render("error");
});


// password secured

// const bcrypt = require("bcryptjs");
//  const securePassword = async (password)=>{
//      const passwordHash = await  bcrypt.hash(password,12);
//      console.log(passwordHash);

//      const passwordMatch = await bcrypt.compare(password,passwordHash);
//      console.log(passwordMatch);

//  }

//  securePassword("Abhay@123");


// const jwt = require("jsonwebtoken");

// const createToken = async () =>{
//   const token =  await jwt.sign({_id:"602ba3ebde7d9e0a08f1977a"},"mynameisabhaymoonforlearningthewebdevlopersoftwaredevloperandsoftwareengineer",{
//                         expiresIn:"7 seconds"
//   });
//     console.log(token);
//     const verified = await jwt.verify(token,"mynameisabhaymoonforlearningthewebdevlopersoftwaredevloperandsoftwareengineer");
//     console.log(verified); 
// }

// createToken();

app.listen(port, ()=> {
    console.log("express server connection is successfully");
})
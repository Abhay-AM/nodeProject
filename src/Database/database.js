// require('dotenv').config({path:"../.env"})
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// const databasename = "mongodb+srv://abhaymoon99gmailcom:Birthday99@cluster0.2i0ac.mongodb.net/RegisterForm?retryWrites=true&w=majority";
const databasename = process.env.DATABASE_NAME;
mongoose.connect(databasename,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(() => 
{console.log("database connection successful")
}).catch((err)=>{ console.log(err)
});
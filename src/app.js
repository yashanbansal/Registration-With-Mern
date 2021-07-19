const express = require("express");

const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");

require("./db/conn");
const Register = require("./models/registers");
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");



app.use(express.json())
app.use(express.urlencoded({extended:false}));

//console.log(static_path);
app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/register",(req,res)=>{
    res.render("register");
})



app.post("/register", async(req,res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
                // console.log(req.body.firstname);
                // console.log(req.body.lastname);
        if(password === cpassword){

            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword:cpassword,

            })
            const registered = await registerEmployee.save();
            res.status(201).render("index");
        }else{
            res.send("Password is Not Matching");
        }
    }catch(e){
        res.status(400).send(e);
    }
})




app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/home",(req,res)=>{
    res.render("index");
})

app.post("/login", async(req, res) =>{
    try{
        const email = req.body.loginemail;
        const password = req.body.loginpassword;

        const userEmail = await Register.findOne({email:email});

        const isMatch  = await bcrypt.compare(password, userEmail.password);
        if(isMatch){
            res.status(201).render("index");
        }else{
            res.send("Password is Not Matching");
        }

    }catch(error){
        res.status(400).send("Invalid Email");
    }
});

app.listen(port, ()=>{
    console.log(`Connection is live at port no. ${port}`);
});

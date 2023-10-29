require('dotenv').config();
const express= require("express");
const bodyParser=require("body-parser");
const dotenv=require("dotenv");
const twilio=require("twilio");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
const ejs=require("ejs");
const Content = require('twilio/lib/rest/Content');


const app=express();


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const sender=process.env.PHONE_NUMBER;


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); 

mongoose.set('strictQuery',false);
mongoose.connect("mongodb://127.0.0.1:27017/hopeDB",{useNewUrlParser:true});


const hopeSchema=new mongoose.Schema({
    aadhaar: Number,
    phone_number: Number,
    occupation: String,
    password: String
});

const UserNumberSchema=new mongoose.Schema({
    userNumber: Number
});


const secret=process.env.SECRET;
hopeSchema.plugin(encrypt,{secret:secret,encryptedFields:['password']});

const User= new mongoose.model("User",hopeSchema);
const Carpenter= new mongoose.model("Carpenters",UserNumberSchema);
const Mechanic= new mongoose.model("Mechanic",UserNumberSchema);
const Plumber= new mongoose.model("Plumber",UserNumberSchema);
const Painter=new mongoose.model("Painter",UserNumberSchema);

console.log(typeof(Carpenter));

app.get("/",(req,res)=>{

    res.render("login_registration");
})

app.get("/register",(req,res)=>{
    
    res.render("register");
})

app.get("/login",(req,res)=>{
    
    res.render("login");
})


app.get("/home",(req,res)=>{
   
    res.render("home");
})


app.post("/register",(req,res)=>{
    const newUser=new User({
        aadhaar: req.body.aadhaar,
        phone_number: req.body.phone_number,
        occupation: req.body.occupation,
        password: req.body.password
    });
    newUser.save()
           .then((registeredUser)=>{
            console.log(registeredUser);
            res.render("home");
           })
           .catch((err)=>{
            console.log(err);
           });
    switch(req.body.occupation){
        case "Carpenter":
            const CarpenterUser=new Carpenter({
                userNumber: req.body.phone_number
            });
            CarpenterUser.save()
                         .then((registeredUser)=>{
                            console.log(registeredUser);
                         })
                         .catch((err)=>{
                            console.log(err);
                         });
            break;
        case "Mechanic":
            const MechanicUser=new Mechanic({
                userNumber: req.body.phone_number
            });
            MechanicUser.save()
                         .then((registeredUser)=>{
                            console.log(registeredUser);
                         })
                         .catch((err)=>{
                            console.log(err);
                         });
            break;
        case "Plumber":
            const PlumberUser=new Plumber({
                userNumber: req.body.phone_number
            });
            PlumberUser.save()
                         .then((registeredUser)=>{
                            console.log(registeredUser);
                         })
                         .catch((err)=>{
                            console.log(err);
                         });
            break;
        case "Painter":
            const PainterUser=new Painter({
                userNumber: req.body.phone_number
            });
            PainterUser.save()
                         .then((registeredUser)=>{
                            console.log(registeredUser);
                         })
                         .catch((err)=>{
                            console.log(err);
                         });
            break;

    }
});


app.post("/login",(req,res)=>{
    const aadhaarTyped=req.body.aadhaar;
    const password=req.body.password;

    User.findOne({aadhaar:aadhaarTyped})
        .then((foundUser)=>{
            if(foundUser){
                if(foundUser.password===password){
                    
                    res.render("home");
                }
                else{
                    
                    res.render("login");
                }
            }
        })
        .catch((error)=>{
            console.log(error);
            res.send(400,"bad request");
        });

});


app.post("/home",(req,res)=>{
    const customer_name=req.body.customer_name;
    const type=req.body.worker;
    const pblm=req.body.Pblm;
    var img= "";
    if(customer_name=="1"){
        img="https://tse3.mm.bing.net/th?id=OIP.JwiBsDkAC0Tbflt7rpCJ7wHaE8&pid=Api&P=0&h=180";
    }
    else if(customer_name=="2"){
        img="https://tse2.mm.bing.net/th?id=OIP.QcO3eAhdfHU6JfVeKx3G4QHaD0&pid=Api&P=0&h=180";
    }
    else if(customer_name=="3"){
        img="https://tse1.mm.bing.net/th?id=OIP.4q9_0EgLGB7amcAF1ua-aQHaEK&pid=Api&P=0&h=180";
    }
    else if(customer_name=="4"){
        img="https://tse4.mm.bing.net/th?id=OIP.9RM_XFy-dvX5DJf5tEALagHaE8&pid=Api&P=0&h=180";
    }
    else if(customer_name=="5"){
        img="https://tse1.mm.bing.net/th?id=OIP.69C9kRLOqzx9ZdQP4g2tfgHaE8&pid=Api&P=0&h=180";
    }
    const str="Service Code : "+req.body.customer_name + ", Ph no : 7842339470      " +img;

    switch(type){
        case "Carpenter":
                         Carpenter.find()
                                  .then((result)=>{
        
                                   var data=[];
                                   result.forEach((i)=>{
                                   data.push("+91"+i.userNumber);
            
                                  })
          

                                    var numbersToMessage=[];
                                    numbersToMessage.push(...data);
                                     var count=0;
                                     numbersToMessage.forEach((number)=>{
                                     client.messages.create({
                                     body: str,
                                     from: sender,
                                     to: number
                                     })
                                    .then((message) => { 
                                    if(count===0){
                                    console.log(message.status);
                                   }
                
                                    count=1;
              
                                  });
            
                                   })
                                     res.render("sucess");
                                   })
                                  .catch((err)=>{
                                   console.log(err);
                                    })
                                   break;
        case "Mechanic":
            Mechanic.find()
            .then((result)=>{

             var data=[];
             result.forEach((i)=>{
             data.push("+91"+i.userNumber);

            })


              var numbersToMessage=[];
              numbersToMessage.push(...data);
               var count=0;
               numbersToMessage.forEach((number)=>{
               client.messages.create({
               body: str,
               from: sender,
               to: number
               })
              .then((message) => { 
              if(count===0){
              console.log(message.status);
             }

              count=1;

            });

             })
               res.render("sucess");
             })
            .catch((err)=>{
             console.log(err);
              }) 
            break;
        case "Plumber":
            Plumber.find()
            .then((result)=>{

             var data=[];
             result.forEach((i)=>{
             data.push("+91"+i.userNumber);

            })


              var numbersToMessage=[];
              numbersToMessage.push(...data);
               var count=0;
               numbersToMessage.forEach((number)=>{
               client.messages.create({
               body: str,
               from: sender,
               to: number
               })
              .then((message) => { 
              if(count===0){
              console.log(message.status);
             }

              count=1;

            });

             })
               res.render("sucess");
             })
            .catch((err)=>{
             console.log(err);
              }) 
            break;
        case "Painter":
            Painter.find()
            .then((result)=>{

             var data=[];
             result.forEach((i)=>{
             data.push("+91"+i.userNumber);

            })

              var numbersToMessage=[];
              numbersToMessage.push(...data);
               var count=0;
               numbersToMessage.forEach((number)=>{
               client.messages.create({
               body: str,
               from: sender,
               to: number
               })
              .then((message) => { 
              if(count===0){
              console.log(message.status);
             }

              count=1;

            });

             })
               res.render("sucess");
             })
            .catch((err)=>{
             console.log(err);
              }) 
            break;

    }
    

       
});

 app.post("/sucess",(req,res)=>{
    res.redirect("/home");
 })

app.listen(process.env.PORT||3000,()=>{
    console.log("server started");
});


// message => console.log(message.sid)

// client.messages
    // .create({
    //  body: message,
    //  from: sender,
    //  to: '+917306407641'
    //  })
    //  .then((message)=>{
    //     console.log(message.sid);
    //     res.sendFile(__dirname+"/sucess.html");
    //  });

    
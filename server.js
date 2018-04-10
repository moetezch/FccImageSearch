const express = require ('express');

const mongo = require("mongodb").MongoClient;




const app=express();


app.get("/",(req,res)=>{
res.send("working")

})



app.listen(3000);
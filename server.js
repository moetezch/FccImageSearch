const express = require ('express');
const request = require("request");
const mongo = require("mongodb").MongoClient;
const API_KEY = "YOUR API KEY"; // Note that this is limited to 100 free requests per day.
const SEARCH_ENGINE_ID = "YOUR CX"; 
let snippet,url,thumbnail,context,J=[];

const app=express();
app.use(express.static("public"));

app.get("/",(req,res)=>{

})

app.get("/api/latest/imageseach", (req, res) => {
  mongo.connect("mongodb://localhost:27017/", function (err, client) {
    if (err) throw err;
    let db = client.db("fccimage");
    let search = db.collection("search");
    search.find({}).project({_id:0}).limit(10).toArray(function (err, docs) {
            if(err) throw err;
            
            res.send(docs)
            client.close();
        });
       

  });
  
})

app.get("/api/imagesearch/:searchTerm",(req,res)=>{
  const searchTerm = req.params.searchTerm
  let offset=1
  if (req.query.offset) {
    offset = req.query.offset
  }
 



  mongo.connect("mongodb://localhost:27017/", function (err, client) {
    if (err) throw err;
    let db = client.db("fccimage");
    let search = db.collection("search");
    search.insertOne({ search: searchTerm,when: new Date });
    client.close();
    
  });
const search = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${searchTerm}&searchType=image&start=${offset}`;

request(search, function (error, response, body) {
  if (!error && response.statusCode == 200) {
   const parsedData=JSON.parse(body);
   

for (const key of Object.keys(parsedData.items)) {
    snippet=parsedData.items[key].snippet
    url=parsedData.items[key].link
    thumbnail =parsedData.items[key].image.thumbnailLink
    context = parsedData.items[key].image.contextLink

  J.push ( {
    snippet,
    url,
    thumbnail,
    context
  })
}

    res.send(J)
    
  }
});
  J = []
});


app.listen(3000);
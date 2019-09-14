var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
// Parses our HTML and helps us find elements
// var cheerio = require("cheerio");
// // Makes HTTP request for HTML page
// var axios = require("axios");
// 
var exphds = require("express-handlebars");
// Require all models
var db = require("./mdls");

// Initialize Express app
var app = express();

//This section uses morgan logger for logging request
app.use(logger("dev"));
//Parse request body as JSON
app.use(bodyParser.urlencoded({ extended: false }));

// try to find paths.json in either the cwd or as a sibling to this file
app.use(express.static(process.cwd() + "/public"));

app.engine("handlebars", exphds({defaultLayout: "main"}));
app.set("view engine" , "handlebars");

// mongoose.connect("mongodb://localhost/newsScrape");
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/newsScrape";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
var db = mongoose.connection;

//log any error that occur during the connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("You're connected to Mongoose!");
  });

  var routes = require("./controller/controller.js");
app.use("/", routes);

//this section creates the localhost port
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("You're using PORT " + port);
});
 


// app.use(express.json());
// //Make public a static folder
// 

// , { useNewUrlParser: true });

// //Routes

// //A GET route for scraping the weather channel website 
// app.get("/scrape", function (req, res) {
//   // Making a request via axios for weather channel. The page's HTML is passed as the callback's third argument
//   axios.get("https://weather.com/").then(function (response) {
//     // Load the HTML into cheerio and save it to a variable
//     // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
//     var $ = cheerio.load(response.data);
//     //Now, grab all h3 within the div tag, and do the following
//     $("div h3").each(function (i, element) {
//       //save an empty result object
//       var result = {};
      
//       //Add the text and href of every link, and save them as properties of the result objects
//       result.title = $(this)
//         .children("a")
//         .text();
//       result.link = $(this)
//       .children("a")
//       .attr("href");

//       //Create a new Article using the 'result' object built from scraping
//       db.Article.create(result)
//       .then(function(databasebArticle){
//         //view the added result in the console
//         console.log(databasebArticle)
//       })
//       .catch(function(err){
//         //this handles the error by logging it
//         console.log(err);
//       });
//     });
    
//     // send a message to the client
//     res.send("Complete Scrap");

//   });
// });

// app.get("/articles", function(req, res){
//   //Grab every doc in the Article collection
//   db.Article.find({})
//     .then(function(databasebArticle){
//       //If article was successfully found, send results back to client
//       res.json(databasebArticle);
//     })
//     .catch(function(err){
//       //this handles the error by logging it
//       res.json(err);
//     });
// });

//   //Route for grabbing a specific Article by id, populate it with it's note
//   app.get("/article/:id", function(req, res){
//     //Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//     db.Article.findOne({_id: req.params.id})
//     //.. and populate all of the notes associcated with it
//     .populate("note")
//     .then(function(databasebArticle){
//       //If we were able to successfully find a Article with the given id, send it back to the client
//     res.json(databasebArticle);
//     })
//     .catch(function(err){
//       res.json(err);
//     });
//   });

//   app.post("/articles/:id", function(req, res) {
//     // Create a new note and pass the req.boby to the entry

//     db.Note.create(req.body)
//     .then(function(databasebArticle) {
//       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       return db.Article.findOneAndUpdate({_id: req.params.id }, {note:dbNote._id}, { new: true});

//     })
//     .then(function(databasebArticle) {
//   }) 
//   .catch(function(err) {
//     res.json(err);
//   });
//     });

//     //Start the server
//     app.listen(PORT, function(){
//       console.log("App running on port" + PORT + "!"); 
//     });
//     // An empty array to save the data that we'll scrape


  
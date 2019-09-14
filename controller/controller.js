//needed dependencies
var express = require("express");
var router = express.Router();
var path = require("path");


//this section is for scraping

// var request = require("request");
var cheerio = require("cheerio");

//this section is the connection to the models folder

var comment = require("../mdls/Comment.js");
var Article = require("../mdls/Articles.js.js");

//this section is for my 1st route

router.get("/", function (req, res) {
    res.redirect("/articles");
});

//this section is a git.request to scrape to weather channel website

router.get("/scrape", function (req, res) {
    res.redirect("https://weather.com", function (err, res, html) {

        //this section loads information into cheerio and saves it into the selector

        var $ = cheerio.load(html)
        var titlesArry = [];

        //this function will grad every article using the class-tag from the weather channel site

        $("c.entry-box--compace_title").each(function (i, element) {
            var result = {};
            // this section adds the text and href of every link and save as result
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .childern("a")
                .attr("href");

            //this section handles empty and duplicate entries before pushing to the database

            if (result.title !== "" && result.link !== "") {
                if (titlesArray.indexOf(result.title) == -1) {

                    Article.count({ title: result.title }, function (err, test) {
                        if (test === 0) {
                            var entry = new Article(result);

                            entry.save(function (err, doc) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(doc);
                                }
                            })
                        }
                    })


                } else {
                    console.log("This Article already exist.");
                }
            } else {
                console.log("You save was not completed, you're missing data");

            }

        });
        res.redirect("/");
    });
});

//this section grabs every article and populate the DOM in the /articles endpoint

router.get("/articles", function(req, res) {
    Article.find().sort({ _id: -1 }).exec(function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            var article1 = { article: doc };
            res.render("index", article1);
        }
    });
});

//this section handles the article json route - 
//it will scrape the articles from mongo and convert to json

router.get("/articles-json", function(req, res) {
    Article.find({}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    });
});


//--------------------- Test at this point-----------------------------
    //this section removes all the articles when accessing the provided 
    // enpoint "clearAll"

    // if I wanted to start with an empty database with no enpoints access the "clearAll"

    router.get("/clearAll", function (req, res) {
        Article.remove({}, function (err, doc) {
            if (err) {
                console.log(err);
            } else {
                console.log("articles removed");
            }
        });
        res.redirect("/articles-json");
    });



//this section read.article route identified with an id
// it will drill down to a specific article 

router.get("/readArticle/:id", function (req, res) {
    var articleId = req.params.id;
    var hbsObj = {
        article: [],
        body: []
    };
});

//find the article by id and grab it from
//then link then places it in handlebars

Article.findOne({ _id: articleId })
    .populate("comment")
    .exec(function (err, doc) {
        if (err) {
            console.log("Error: " + err);
        } else {
            hbsObj.article = doc;
            var linke = doc.link;
            request(link, function (error, respons, html) {
                var $ = cheerio.load(html);
                $(".l-col_main").each(function (i, element) {
                    hbsObj.body = $(this)
                        .children(".c-entry-content")
                        .children("p")
                        .text();

                    res.render("article", hbsObj);
                    return false;
                });
            });
        }
    });

//this section generates the comments and display from the mongodb

router.post("/comment/:id", function (req, res) {
    var user = req.body.name;
    var content = req.body.comment;
    var articleId = req.params.id;

    var commentObj = {
        name: user,
        body: content

    };

    var newComment = new Comment(commentObj);
    newComment.save(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log(doc._id);
            console.log(articleId);

            Article.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { comment: doc._id } },
                { new: true }
            ).exec(function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/readArticle/" + articleId);
                }
            })
        }
    });
});


// // -------------------Test at this point ----------------------------
module.export = router;

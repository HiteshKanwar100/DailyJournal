

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Welcome to our blog website's home page, a vibrant hub of diverse and engaging content. Discover captivating blog posts covering technology, lifestyle, travel, arts, and more. Each post, adorned with captivating titles, offers insights, personal experiences, and thought-provoking narratives. Engage effortlessly with our user-friendly interface, leaving comments and ratings to spark meaningful discussions with writers and fellow readers.Want to join the conversation? Head to the '/compose' URL and become part of our inclusive community. Create an account, share your passions, and craft your own captivating blog posts with titles that inspire curiosity. Embrace a journey of discovery and inspiration as we celebrate creativity, knowledge-sharing, and empathy in the blogosphere. Together, let's embark on a meaningful exchange of ideas and stories, making this platform a true reflection of diverse voices and perspectives. Welcome to a world of endless possibilities, where every blog post brings us closer together.";
const aboutContent = "At Daily Journal, we are passionate about fostering a dynamic and inclusive community of writers, readers, and knowledge-seekers. Our journey began with a simple vision - to create a platform that celebrates the power of words and the diversity of human experiences. As avid believers in the transformative potential of storytelling, we strive to curate a rich collection of thought-provoking blog posts that inspire, educate, and connect people from all walks of life.";
const contactContent = "We value your feedback, inquiries, and connections. Whether you have a question, a suggestion, or simply want to say hello, we're eager to hear from you. Feel free to get in touch with us using any of the following methods:";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-hiteshk:hitesh307@cluster0.e6v7d9u.mongodb.net/blogPostDB", {
  useNewUrlParser: true,
});

const blogSchema = new mongoose.Schema({ title: String , content : String });
const Blog  = new mongoose.model("Blog", blogSchema);


app.get("/", function(req, res) {
  Blog.find({}).then((data) => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: data
    });
  }).catch((err) => {
    // Handle the error, if any
    console.error(err);
    res.status(500).send("Error fetching blog posts.");
  });
});


app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Blog( {
    title: req.body.postTitle,
    content: req.body.postBody
  });
   post.save().then(() => {
  res.redirect("/");
}).catch((err) => {
  console.error("Error saving the post:", err);
  // Optionally, you can send an error response or redirect to an error page
  // For example: res.status(500).send("Error saving the post.");
});


});

app.get("/posts/:postName", function(req, res){
  const requestedId = req.params.postName;
  Blog.findOne({_id : requestedId}).then((post)=>{
      res.render("post", {
        title: post.title,
        content: post.content
      });
  });
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

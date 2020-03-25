var express = require('express');
var body_parser = require('body-parser');
var mongoose = require('mongoose'); 
var methodOverride = require('method-override');
var app = express();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/blog_app");


app.use(express.static('public')); // This line.
app.use(body_parser.urlencoded({extended : true}))
app.use(methodOverride("_method"))
app.set("view engine","ejs");


var blogschema = new mongoose.Schema({
    title : String,
    tag : String,
    image : String,
    desc : String
})

var blog = new mongoose.model("blog",blogschema);


app.get("/",(req,res)=>{
    res.render("land");
});

app.get("/blogs",(req,res)=>{
    blog.find({},(err,blog)=>{
        if(err){
            console.log(err)
        }else{
            res.render("home",{blog : blog});
        }
    }) 
});

app.post('/blogs',(req,res)=>{
    var title = req.body.title;
    var tag = req.body.tag;
    var image = req.body.image;
    var desc = req.body.desc;

    var nblog = {title : title , tag : tag , image : image , desc : desc}

    blog.create(nblog, (err,blog)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    })
})

app.get("/blogs/new",(req,res)=>{
    res.render("new");
})

app.get("/blogs/:id",(req,res)=>{
    blog.findById(req.params.id,(err,pblog)=>{
        if(err){
            console.log(err)
        }else{
            res.render("show",{blog : pblog});
        }
    })
})

app.get("/blogs/:id/edit",(req,res)=>{
    blog.findById(req.params.id,(err,pblog)=>{
        if(err){
            console.log(err)
        }else{
            res.render("edit",{blog : pblog});
        }
    })
})

app.put('/blogs/:id',(req,res)=>{
    blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,ablog)=>{
        if(err){
            console.log(err)
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }
    })
})

app.delete("/blogs/:id",(req,res)=>{
    blog.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    })
})

app.listen(3001,()=>{
    console.log("It on");
})
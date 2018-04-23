const express = require('express')
const Blog    = require('./models/blog')
const Comment = require('./models/comment')
const User    = require('./models/user')
const passport= require('passport')

const router  = express.Router()


module.exports =  router

//Redirect Home to /blogs
    .get('/', (req, res) => {
        res.redirect('/blogs')
    })

//Get all blogs
    .get('/blogs', (req, res) => {
        Blog.find({}, (err, allBlogs) => {
            err ? res.send(err) : res.render('index', { blogs: allBlogs})
        })
    })

// Create a blog
    .post('/blogs',isLoggedIn, (req, res) => {
        Blog.create({
            title : req.body.title,
            image : req.body.image,
             body : req.body.body
        }, (err, blog) => {
            if (err) {
             res.send(err)   
            } else {
             res.redirect("/")  
            }
        })
    })

// Add new blog form
    .get('/blogs/new',isLoggedIn, (req, res) => {
        res.render('new')
    })

// Get a specific blog
    .get('/blogs/:id', (req, res) => {
        Blog.findById(req.params.id).populate("comments").exec((err, blog) => {
            if (err) {
              res.send(err)  
            } else {              
               res.render('blog' , {blog : blog}) 
            }
        }) 
    })

// Edit form for a specific blog
    .get('/blogs/:id/edit', (req, res) => {
       Blog.findById(req.params.id, (err, blog)=> {
           err ? res.send(err) : res.render('edit', { blog : blog})
       })
    })
// Edit a specific blog
    .put('/blogs/:id', (req, res) => {
        Blog.findById(req.params.id, (err, blog) => {
            if (err) {
                res.send(err)
            } else {
                blog.title = req.body.title
                blog.image = req.body.image
                blog.body  = req.body.body
                
                blog.save(err => {
                    err ? res.send(err) : res.redirect('/blogs/' + req.params.id )
                })
            }
        })
    })

// Delete a specific blog
    .delete('/blogs/:id', (req, res) => {
        Blog.findByIdAndRemove(req.params.id, (err, blog) => {
            err ? res.send(err) : res.redirect('/blogs')
        })
    })

// Add comment form

    .get('/blogs/:id/comments/new', isLoggedIn, (req, res) => {
        Blog.findById(req.params.id, (err, foundBlog) => {
            if (err) {
              res.send(err)  
            } else {
                res.render('comment', { blog : foundBlog}) 
            }
        })
    })
// Add a Comment 
    .post('/blogs/:id/comments', isLoggedIn, (req, res) => {
        Blog.findById(req.params.id, (err, blog) => {
            if (err) {
              res.send(err)  
            } else {
               Comment.create(req.body.comment, (err, comment)=> {
                  if (err) {
                      res.send(err)
                  } else {
                    blog.comments.push(comment);
                    blog.save((err) => {
                        err ? res.send(err) : res.redirect('/blogs/' + req.params.id)
                    })     
                  }
               })               
            }
        })
    })

// Register

    .get('/register', (req, res) => {
    res.render("register")
    })

    .post('/register', (req, res) => {
        User.register({ username : req.body.username}, req.body.password, (err, user)=> {
            if (err) {
              console.log(err);
              return res.render('register');
            } else {
              passport.authenticate("local")(req, res, () => {
                 res.redirect('/blogs')
              })
            }
        })
    })

//Login

    .get('/login', (req, res) => {
        res.render('login')
    })

    .post('/login', passport.authenticate("local", {
        successRedirect : '/blogs',
        failureRedirect : '/login'

    }), (req, res) => {

    })
//Logout

    .get('/logout', (req, res) => {
        req.logout();
        res.redirect('/blogs')
    })

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

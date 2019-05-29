const mongoose = require("mongoose"),
  os = require("os"),
  Posts = require("../models/Posts"),
  Media = require("../models/Media"),
  Categ = require("../models/Categ");
module.exports = app => {
  app.get("/", (req, res) => {
    res.render("Visitor/Home");
  });
  app.get("/contact", (req, res) => {
    res.render("Visitor/contact");
  });
  app.get("/live", (req, res) => {
    Media.find({}, (err, live) => {
      if (err) {
        console.log(err);
      } else {
        Posts.find({}, (err, AllPosts) => {
          if (err) {
            console.log(err);
          } else {
            Categ.find()
              .then(Categ => {
                const LastPost = AllPosts.sort();
                res.render("Visitor/Live", {
                  Live: live[0],
                  Posts: AllPosts,
                  LastPost: LastPost
                });
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
      }
    });
  });
  app.get("/news", (req, res) => {
    const page = req.query.page
    Posts.find({}, (err, AllPosts) => {
      if (err) {
        console.log(err);
      } else {
        Categ.find()
          .then(Categ => {
            if (!page) {
              return res.redirect('/news?page=1')
            } else if (AllPosts.length < (page * 10) - 10) {
              return stop()
            }
            const LastPost = AllPosts.sort();
            res.render("Visitor/News", {
              Posts: AllPosts,
              LastPost: LastPost,
              Categ: Categ,
              Count: page * 10
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  });
  app.get("/news/:post", (req, res) => {
    Posts.findById(req.params.post)
      .populate("Comments")
      .exec()
      .then(Post => {
        Posts.findByIdAndUpdate(
          req.params.post, {
            Views: Post.Views + 1
          },
          (err, cb) => {
            if (err) {
              console.log("error");
            } else {
              console.log("view added");
            }
          }
        );
        res.render("Visitor/SingleBlog", {
          Post: Post
        });
      })
      .catch(err => {
        console.log(err);
        res.redirect("/news");
      });
  });
  app.get('/search', (req, res, next) => {
    const query = req.query.res;
    const page = req.query.page
    Posts.find({
        Title: {
          $regex: `.*${query}.*`
        }
      })
      .then(results => {
        if (!page) {
          return res.redirect('/news')
        } else if (results.length < (page * 10) - 10) {
          return next()
        }
        res.render("Visitor/Search", {
          Posts: results,
          query: query,
          Count: page * 10
        });
      })
      .catch(err => {
        res.redirect('/news')
      })
  });
  app.post("/somthing", (req, res) => {
    Media.find()
      .then(media => {
        res.send(media[0]);
      })
      .catch(err => {
        console.log("No Social Media Found");
      });
  });
};
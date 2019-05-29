var passport = require("passport"),
  SignVal = require("../helpers/SignVal"),
  LogVal = require("../helpers/LogVal"),
  Admins = require("../models/Users"),
  Posts = require("../models/Posts"),
  Messages = require("../models/Messages"),
  Media = require("../models/Media"),
  Comments = require("../models/Comments"),
  Visitors = require("../models/Visitors"),
  Categ = require("../models/Categ"),
  Draft = require("../models/Draft"),
  MyImg = require("../models/MyImg"),
  fs = require("fs"),
  path = require("path"),
  FroalaEditor = require("../Froala Sdk/lib/froalaEditor"),
  upload_image = require("./image_Upload"),
  multer = require("multer"),
  check = require('../helpers/AuthBy'),
  MyImg = require("../models/MyImg");

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/../public/Upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".png");
  }
});

var upload = multer({
  storage: storage
}).single("ImgUpload");
module.exports = app => {
  //-------------------------------------------------

  app.get("/admin/signup", (req, res) => {
    Admins.find()
      .then(account => {
        if (account.length > 0) {
          res.redirect("/");
        } else {
          const errors = req.flash("error");
          res.render("Admin/Account/SignUp", {
            messages: errors,
            hasError: errors.length > 0
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  });

  app.post(
    "/signup",
    SignVal,
    passport.authenticate("local.signup", {
      successRedirect: "/admin/dashboard",
      failureRedirect: "/admin/signup",
      failureFlash: true
    })
  );

  //---------------------------------------------------------

  app.get("/admin/login", (req, res) => {
    if (req.user) {
      return res.redirect('/admin/dashboard')
    }
    const errors = req.flash("error");
    res.render("Admin/Account/SignIn", {
      messages: errors,
      hasError: errors.length > 0
    });
  });

  app.post(
    "/login",
    LogVal,
    passport.authenticate("local.login", {
      successRedirect: "/admin/dashboard",
      failureRedirect: "/admin/login",
      failureFlash: true
    })
  );

  // -----------------------------------------------------------
  app.use('/admin/*', (req, res, next) => {
    if (!req.user) {
      return res.redirect("/admin/login");
    }
    next()
  });

  app.post('/admin/user/:id', (req, res, done) => {
    var Messages = []
    Admins.findById(req.params.id)
      .then(User => {
        var NewPass = req.body.newpass;
        if (!req.body.newpass) {
          NewPass = User.Password;
        }
        if (User.ValidUserPassword(req.body.oldpass, User.Password)) {
          Admins.findByIdAndUpdate(req.params.id, {
            UserName: req.body.username,
            Email: req.body.email,
            Password: User.encryptPassword(NewPass),
            FirstName: req.body.fname,
            LastName: req.body.lname,
          }, (err, user) => {
            if (err) {
              Messages.push(err.message)
              return done(null, false, req.flash("error", Messages), res.redirect('/admin/dashboard/profile'))
            }
            res.redirect('/admin/dashboard/profile')
          })
        } else {
          Messages.push("Password Not Valid")
          return done(null, false, req.flash("error", Messages), res.redirect('/admin/dashboard/profile'))
        }
      })
      .catch(err => {
        Messages.push(err.message)
        return done(null, false, req.flash("error", Messages), res.redirect('/admin/dashboard/profile'))
      })
  });
  app.get("/admin/dashboard", (req, res) => {
    Posts.find().then(Post => {
      Visitors.find().then(Visitor => {
        Admins.find().then(User => {
          Comments.find().then(comment => {
            Messages.find().then(Msg => {
              res.render("Admin/Dashboard/Dashboard", {
                PostsLen: Post.length,
                VisitLen: Visitor.length,
                UsersLen: User.length,
                CommentsLen: comment.length,
                MessagesLen: Msg.length
              });
            });
          });
        });
      });
    });
  });
  //---------------------------------------------------------------------

  app.get("/admin/dashboard/posts", (req, res) => {
    Posts.find({}, (err, Posts) => {
      if (err) {
        console.log(err);
      } else {
        Categ.find().then(Cat => {
          MyImg.find().then(Img => {
            res.render("Admin/Dashboard/Posts", {
              Categ: Cat,
              Posts: Posts,
              Imgs: Img
            });
          });
        });
      }
    });
  });

  //------------------------------------------------------

  app.get("/admin/dashboard/new-post", (req, res) => {
    Categ.find()
      .then(Cat => {
        MyImg.find().then(Img => {
          res.render("Admin/Dashboard/NewPost", {
            Categ: Cat,
            Imgs: Img
          });
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
  app.get("/admin/dashboard/edit-post/:id", (req, res) => {
    Posts.findById(req.params.id)
      .then(data => {
        Categ.find()
          .then(cat => {
            MyImg.find().then(Imgs => {
              res.render("Admin/Dashboard/EditPost", {
                Post: data,
                Imgs: Imgs,
                Categ: cat
              });
            });
          })
          .catch(err => {
            res.redirect("/admin/dashboard/posts");
          });
      })
      .catch(err => {
        res.send(err);
      });
  });

  app.post("/admin/dashboard/edit/:id", (req, res) => {
    Posts.findByIdAndUpdate(
      req.params.id, {
        Title: req.body.Title,
        Thumbnail: req.body.Thumbnail,
        Categ: req.body.Categ,
        Content: req.body.Content
      },
      function (err, data) {
        if (err) {
          res.send(err);
        } else {
          res.send(data);
        }
      }
    );
  });

  app.get("/admin/dashboard/edit-draft/:id", (req, res) => {
    Draft.findById(req.params.id)
      .then(data => {
        Categ.find()
          .then(cat => {
            MyImg.find().then(Imgs => {
              res.render("Admin/Dashboard/Edit-Draft", {
                Post: data,
                Imgs: Imgs,
                Categ: cat
              });
            });
          })
          .catch(err => {
            res.redirect("/admin/dashboard/Draft");
          });
      })
      .catch(err => {
        res.send(err);
      });
  });

  app.post("/admin/dashboard/edit-draft/:id", (req, res) => {
    Draft.findByIdAndUpdate(
      req.params.id, {
        Title: req.body.Title,
        Thumbnail: req.body.Thumbnail,
        Categ: req.body.Categ,
        Content: req.body.Content
      },
      function (err, data) {
        if (err) {
          res.send(err);
        } else {
          res.send(data);
        }
      }
    );
  });

  app.post("/admin/dashboard/new-post", (req, res) => {
    var NewPost = new Posts();
    NewPost.Title = req.body.Title;
    NewPost.Thumbnail = req.body.Thumbnail;
    NewPost.Content = req.body.Content;
    NewPost.Categ = req.body.Categ;
    NewPost.save((err, Post) => {
      if (err) {
        res.send(err);
      } else {
        res.send(Post);
      }
    });
  });
  app.get("/admin/dashboard/draft", (req, res) => {
    Draft.find()
      .then(draft => {
        res.render("Admin/Dashboard/Draft", {
          Posts: draft
        });
      })
      .catch(err => {
        res.render("Admin/Dashboard/Draft");
      });
  });
  app.post("/admin/dashboard/draft", (req, res) => {
    var NewDraft = new Draft();
    NewDraft.Title = req.body.Title;
    NewDraft.Thumbnail = req.body.Thumbnail;
    NewDraft.Content = req.body.Content;
    NewDraft.save((err, Post) => {
      if (err) {
        res.send("error");
      } else {
        res.send(Post);
      }
    });
  });
  app.post("/admin/dashboard/delete/:id", (req, res) => {
    Posts.findById(req.params.id)
      .then(Post => {
        Draft.create({
            Title: Post.Title,
            Thumbnail: Post.Thumbnail,
            Content: Post.Content
          },
          function (err, post) {
            if (err) {
              res.send(err);
            } else {
              res.send(post);
            }
          }
        );
      })
      .catch(err => {
        res.send(err);
      });
  });

  app.delete("/admin/dashboard/delete/:id", (req, res) => {
    Posts.findByIdAndRemove(req.params.id, (err, post) => {
      if (err) {
        res.send("error");
      } else {
        res.send(post.Title);
      }
    });
  });

  app.post("/admin/dashboard/publish/:id", (req, res) => {
    Draft.findById(req.params.id)
      .then(Post => {
        Posts.create({
            Title: Post.Title,
            Thumbnail: Post.Thumbnail,
            Content: Post.Content
          },
          function (err, post) {
            if (err) {
              res.send(err);
            } else {
              res.send(post);
            }
          }
        );
      })
      .catch(err => {
        res.send(err);
      });
  });

  app.delete("/admin/dashboard/remove/:id", (req, res) => {
    Draft.findByIdAndRemove(req.params.id, (err, post) => {
      if (err) {
        res.send("error");
      } else {
        res.send(post.Title);
      }
    });
  });
  //------------------------------------------------------------------

  app.get("/admin/dashboard/users", (req, res) => {
    Admins.find({}, (err, Users) => {
      if (err) {
        console.log(err);
      } else {
        res.render("Admin/Dashboard/Users", {
          Users: Users
        });
      }
    });
  });
  app.get("/admin/dashboard/profile", (req, res) => {
    const errors = req.flash("error");
    res.render("Admin/Dashboard/Profile", {
      messages: errors,
      hasError: errors.length > 0
    });
  });

  app.get("/admin/dashboard/socialmedia", (req, res) => {
    Media.find()
      .then(media => {
        res.render("Admin/Dashboard/SocialMedia", {
          Media: media
        });
      })
      .catch(err => {
        console.log("No Social Media Found");
      });
  });
  app.post("/admin/dashboard/socialmedia", (req, res) => {
    Media.find((err, DATA) => {
      if (err) {
        res.redirect("/admin/dashboard/socialmedia");
      } else if (DATA[0]._id) {
        Media.findByIdAndUpdate(
          "Media", {
            fb: req.body.fb,
            Insta: req.body.Insta,
            YouTube: req.body.YouTube,
            Live: req.body.Live,
            Twitter: req.body.Twitter,
            rss: req.body.rss
          },
          function (err, data) {
            if (err) {
              res.redirect("/admin/dashboard/socialmedia");
            } else {
              res.redirect("/admin/dashboard/socialmedia");
            }
          }
        );
      } else {
        Media.create({}, {
            _id: "Media",
            fb: req.body.fb,
            Insta: req.body.Insta,
            YouTube: req.body.YouTube,
            Live: req.body.Live,
            Twitter: req.body.Twitter,
            rss: req.body.rss
          },
          function (err, data) {
            if (err) {
              res.redirect("/admin/dashboard/socialmedia");
            } else {
              res.redirect("/admin/dashboard/socialmedia");
            }
          }
        );
      }
    });
  });

  app.post("/add-categ", (req, res) => {
    NewCteg = new Categ();
    NewCteg.Name = req.body.Categ;
    NewCteg.save((err, categ) => {
      if (err) {
        res.send("error");
      } else {
        res.send(categ);
      }
    });
  });

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.post("/upload", (req, res) => {
    upload(req, res, function (err) {
      if (err) {
        return res.send("error");
      }
      const ThisImg = new MyImg();
      Url = req.file.path;
      ThisImg.Url = "/public/Upload/" + req.file.filename;
      ThisImg.save(err => {});
      console.log(Url);
      res.send(ThisImg.Url);
    });
  });

  // Path to upload file.
  app.post("/upload_file", function (req, res) {
    // Store file.
    FroalaEditor.File.upload(req, "/uploads/", function (err, data) {
      // Return data.
      if (err) {
        return res.send(JSON.stringify(err));
      }

      res.send(data);
    });
  });

  // Path to upload image.
  app.post("/image_upload", function (req, res) {
    upload_image(req, function (err, data) {
      if (err) {
        return res.status(404).end(JSON.stringify(err));
      }

      res.send(data);
    });
  });

  var filesDir = path.join(path.dirname(require.main.filename), "uploads");

  if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
  }
};
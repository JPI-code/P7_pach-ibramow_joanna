
// MODULES
const mysql = require('../connection').connection
const fs = require("fs"); // Permet de gérer les fichiers stockés
// FIN MODULES

function getNewestFile(files, path) {
    var out = [];
    files.forEach(function(file) {
        var stats = fs.statSync(path + "/" +file);
        if(stats.isFile()) {
            out.push({"file":file, "mtime": stats.mtime.getTime()});
        }
    });
    out.sort(function(a,b) {
        return b.mtime - a.mtime;
    })
    return (out.length>0) ? out[0].file : "";
}

// MIDDLEWARE GETALLPOSTS TO OBTAIN ALL MESSAGES
exports.getAllPosts = (req, res, next) => {
    const userID = req.query.userID;

    let sqlGetPosts;

    sqlGetPosts = `SELECT Post.postID, post.userID, legend, gifUrl, DATE_FORMAT(post.dateCreation, 'le %e %M %Y à %kh%i') AS dateCreation, firstName, lastName, pseudo, avatarUrl,
    COUNT(CASE WHEN reaction.reaction = 1 then 1 else null end) AS countUp,
    COUNT(CASE WHEN reaction.reaction = -1 then 1 else null end) AS countDown,
    SUM(CASE WHEN reaction.userID = ? AND reaction.reaction = 1 then 1 WHEN reaction.userID = ? AND reaction.reaction = -1 then -1 else 0 end) AS yourReaction,
    COUNT(CASE WHEN Post.userID = ? then 1 else null end) AS yourPost
    FROM Post LEFT OUTER JOIN User ON Post.userID = User.userID LEFT OUTER JOIN Reaction ON Post.postID = Reaction.postID WHERE post.postIDComment IS NULL GROUP BY Post.postID ORDER BY post.postID DESC`;
    mysql.query(sqlGetPosts, [userID, userID, userID], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (result.length == 0) {
            return res.status(400).json({});
        }
        res.status(200).json(result);
    });
};
// FIN MIDDLEWARE

// MIDDLEWARE GETONEPOST pour obtenir un message
exports.getOnePost = (req, res, next) => {
    const userID = res.locals.userID;
    const postID = req.params.id;

    let sqlGetPost;

    sqlGetPost = `SELECT Post.postID, post.userID, legend, body, gifUrl, DATE_FORMAT(post.dateCreation, 'le %e %M %Y à %kh%i') AS dateCreation, firstName, lastName, pseudo, avatarUrl,
    COUNT(CASE WHEN reaction.reaction = 1 then 1 else null end) AS countUp,
    COUNT(CASE WHEN reaction.reaction = -1 then 1 else null end) AS countDown,
    SUM(CASE WHEN reaction.userID = ? AND reaction.reaction = 1 then 1 WHEN reaction.userID = ? AND reaction.reaction = -1 then -1 else 0 end) AS yourReaction,
    COUNT(CASE WHEN Post.userID = ? then 1 else null end) AS yourPost
    FROM Post LEFT OUTER JOIN User ON Post.userID = User.userID LEFT OUTER JOIN Reaction ON Post.postID = Reaction.postID WHERE Post.postID = ? OR Post.postIDComment = ? GROUP BY Post.postID ORDER BY post.postID DESC`;
    mysql.query(sqlGetPost, [userID, userID, userID, postID, postID], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (result.length == 0) {
            return res.status(400).json({ message: "Aucun post à afficher !" });
        }
        res.status(200).json(result);
    });
};
// FIN MIDDLEWARE

// MIDDLEWARE CREATEPOST pour céer les messages
exports.createPost = (req, res, next) => {
    console.log(req.body) 
    const userID = req.body.userID;
    const legend = req.body.legend;
    fs.readdir('../backend/images', function(err, files) {
        if (err) { return console.error(err); }
        var file = getNewestFile(files, '../backend/images');
        //process audioFile here or pass it to a function...
        //console.log(file);
        const gifUrl = `${req.protocol}://${req.get("host")}/images/${file}`;
        console.log(gifUrl)
        let sqlCreatePost;
        let values;
        sqlCreatePost = "INSERT INTO post VALUES (NULL, ?, ?, ?, NULL, NULL, NOW())";
        values = [userID, legend, gifUrl];
        console.log(values) 
        mysql.query(sqlCreatePost, values, function (err, result) {
            if (err) {
                console.log(err.sqlMessage)
                return res.status(500).json(err.sqlMessage);
            }
            res.status(201).json({ message: "Post crée !" });
        });
    })

};

exports.modifyPost = (req, res, next) => {
    const postID = req.params.id;
    const userID = res.body.userID;
    const legend = req.body.legend;
    const gifUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;


    
    let sqlModifyPost;
    sqlModifyPost = "UPDATE post SET legend =? WHERE postID = ? AND userID = ?"
    mysql.query(sqlSelectPost, [legend, postID, userID], function (err, result) {
        if (err){
            return res.status(500).json(err.message);  
        }
        res.status(200).json({ message: "Post modifié !" });
    });
};
// FIN MIDDLEWARE

// MIDDLEWARE DELETEPOST pour supprimer les messages
exports.deletePost = (req, res, next) => {
    const postID = req.params.id;
    const userID = res.locals.userID;

    let sqlDeletePost;
    let sqlSelectPost;

    sqlSelectPost = "SELECT gifUrl FROM Post WHERE postID = ?";
    mysql.query(sqlSelectPost, [postID], function (err, result) {
        if (result > 0) {
            const filename = result[0].gifUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => { // On supprime le fichier image en amont
                sqlDeletePost = "DELETE FROM Post WHERE userID = ? AND postID = ?";
                mysql.query(sqlDeletePost, [userID, postID], function (err, result) {
                    if (err) {
                        return res.status(500).json(err.message);
                    }
                    res.status(200).json({ message: "Post supprimé !" });
                });
            });
        } else {
            sqlDeletePost = "DELETE FROM Post WHERE userID = ? AND postID = ?";
            mysql.query(sqlDeletePost, [userID, postID], function (err, result) {
                if (err) {
                    return res.status(500).json(err.message);
                }
                res.status(200).json({ message: "Post supprimé !" });
            });
        }
        if (err) {
            return res.status(500).json(err.message);
        }


    });
};
// FIN MIDDLEWARE

// MIDDLEWARE CREATECOMMENT pour créer des commentaires
exports.createComment = (req, res, next) => {
    const postID = req.params.id;
    const userID = req.body.userID;
    const body = req.body.content;
    console.log("comment-content:", req.body.content);
    let sqlCreateComment;
    let values;

    sqlCreateComment = "INSERT INTO post VALUES (NULL, ?, NULL, NULL, ?, ?, NOW())";
    values = [userID, postID, body];
    mysql.query(sqlCreateComment, values, function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        }
        res.status(201).json({ message: "Commentaire crée !" });
    });
};
// FIN MIDDLEWARE

// MIDDLEWARE REACTPOST pour créer une réaction sur les messages
exports.reactPost = (req, res, next) => {
    const userID = req.body.userID;
    const reaction = req.body.reaction;
    const postID = req.params.id;
    console.log("REACTION : " + reaction);
    console.log("POSTID : " + postID);
    console.log("USERID : " + userID);
    let sqlReaction;
    let values;

    sqlReaction = `INSERT INTO Reaction VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE reaction = ?`;
    values = [userID, postID, reaction, reaction];
    mysql.query(sqlReaction, values, function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        }
        res.status(201).json({ message: "Reaction créée !" });
    });
};

// FIN MIDDLEWARE
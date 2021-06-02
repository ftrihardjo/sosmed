const express = require('express');
const app = express();
const PORT = 5000
const pool = require('./db');

app.use(express.json());

//Get a post and related comments and replies.
app.get('/tweet', async (req,res) => {
    try {
        const post_id = req.body.post_id;
        const tweets = await pool.query("SELECT p.post_id post_id, p.username posting_user, p.content post, c.username commenting_user, c.content user_comment, r.username replying_user, r.content reply FROM posts p INNER JOIN comments c ON p.post_id = c.post_id INNER JOIN replies r ON c.comment_id = r.comment_id WHERE p.post_id = $1",[post_id]);
        res.json(tweets.rows);
    } catch (error) {
        console.error(error.message);
    }
});

//Create a post.
app.post('/post', async (req, res) => {
    try {
        const user = req.body.user;
        const content = req.body.content;
        await pool.query("INSERT INTO posts(username,content) VALUES ($1,$2)",[user,content]);
    } catch (error) {
        console.error(error.message);
    }
});

//Create a comment to a post.
app.post('/comment', async (req, res) => {
    try {
        const user = req.body.user;
        const content = req.body.content;
        const post_id = req.body.post_id;
        await pool.query("INSERT INTO comments(post_id,username,content) VALUES ($1,$2,$3)",[post_id,user,content]);
    } catch (error) {
        console.error(error.message);
    }
});

//Create a reply to a comment.
app.post('/reply', async (req, res) => {
    try {
        const user = req.body.user;
        const content = req.body.content;
        const comment_id = req.body.comment_id;
        await pool.query("INSERT INTO replies(comment_id,username,content) VALUES ($1,$2,$3)",[comment_id,user,content]);
    } catch (error) {
        console.error(error.message);
    }
});

app.listen(PORT,() => console.log('Listening on port %d.',PORT));
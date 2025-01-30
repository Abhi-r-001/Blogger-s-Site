import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);  
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

const blogPostsFilePath = path.join(__dirname, 'blogs.json');
const quotesFilePath = path.join(__dirname, 'quotes.json');

function getBlogPosts() {
    try {
        if (fs.existsSync(blogPostsFilePath)) {
            const data = fs.readFileSync(blogPostsFilePath, 'utf8');
            return JSON.parse(data);
        } else {
            return [];
        }
    } catch (err) {
        console.error('Error reading blog posts file:', err);
        return [];
    }
}

function saveBlogPosts(posts) {
    try {
        fs.writeFileSync(blogPostsFilePath, JSON.stringify(posts, null, 2), 'utf8');
    } catch (err) {
        console.error('Error saving blog posts to file:', err);
    }
}

function getQuotes() {
    try {
        if (fs.existsSync(quotesFilePath)) {
            const data = fs.readFileSync(quotesFilePath, 'utf8');
            return JSON.parse(data);
        } else {
            return [];
        }
    } catch (err) {
        console.error('Error reading quotes file:', err);
        return [];
    }
}

function saveQuotes(quotes) {
    try {
        fs.writeFileSync(quotesFilePath, JSON.stringify(quotes, null, 2), 'utf8');
    } catch (err) {
        console.error('Error saving quotes to file:', err);
    }
}

app.get("/", (req, res) => {
    const blogPosts = getBlogPosts();
    res.render("index", { blogs: blogPosts });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/create", (req, res) => {
    res.render("create");
});

app.get("/edit", (req, res) => {
    res.render("edit");
});

app.post("/submit", (req, res) => {
    const { fName, Title, blog } = req.body;
    const post = { id: Date.now(), fName, Title, blog };
    const blogPosts = getBlogPosts();
    blogPosts.push(post);
    saveBlogPosts(blogPosts);
    res.redirect("/");
});

app.get("/post/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const blogPosts = getBlogPosts();
    const post = blogPosts.find(p => p.id === postId);
    if (post) {
        res.render("post", { post });
    } else {
        res.status(404).send("Post not found");
    }
});

app.get("/quotes", (req, res) => {
    const quotes = getQuotes();
    res.render("quotes", { quotes });
});

app.post("/add-quote", (req, res) => {
    const { text, author } = req.body;
    const newQuote = { text, author };
    const quotes = getQuotes();
    quotes.push(newQuote);
    saveQuotes(quotes);
    res.redirect("/quotes");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

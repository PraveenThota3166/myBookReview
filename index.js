import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from 'dotenv';

// Configure dotenv to load environment variables from .env file
dotenv.config();


var port=3000;
var app=express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = new pg.Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 30000, // 30 seconds
    idleTimeoutMillis: 30000, // 30 seconds
});

db.connect();

app.get("/", async(req, res)=>{
    var result = await db.query("select * from bookreview");
    res.render("index.ejs", {books: result.rows});
});
app.get("/title", async(req, res)=>{
    var result = await db.query("select * from bookreview order by title");
    res.render("index.ejs", {books: result.rows});
});
app.get("/latest", async(req, res)=>{
    var result = await db.query("select * from bookreview order by readby desc");
    res.render("index.ejs", {books: result.rows});
});
app.get("/rating", async(req, res)=>{
    var result = await db.query("select * from bookreview order by rating desc");
    res.render("index.ejs", {books: result.rows});
});
app.listen(port, ()=>{
    console.log("Server is running on port 3000");
});
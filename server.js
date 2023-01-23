var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
const cors = require('cors');


const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
app.use(cors());
require('dotenv').config();
app.use(express.json())
app.get('/', (req, res) => {
    res.send( "API Listening");
});

onHttpStart = () => {
    console.log('server listening on port ' + HTTP_PORT);
    
}

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
    });
   }).catch((err)=>{

    console.log(err);
   });
   

app.get( "/api/movies/:id", (req, res) => {
    
   
     db.getMovieById(req.params.id).then((data) => {
       
       res.status(200).json(data);
    }).catch((error)=>{
        
        res.status(500).send(error)
    })
   })
app.get("/api/movies", (req,res) => {
    db.getAllMovies(req.query.page, req.query.perPage,req.query.title)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            res.status(500).json(error);
        });
});

app.post("/api/movies", (req,res) => {
    db.addNewMovie(req.body)
    .then(() => {
            res.status(201).send("new Movie has been added");
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});


app.put("/api/movies/:id", (req,res) => {
   db.updateMovieById(req.body, req.params.id)
        .then(() => {
            res.status(200).send("successfully updated");
        })
        .catch((error) => {
            res.status(500).json(error);
        });
});

app.delete("/api/movies/:id", (req,res) => {
    db.deleteMovieById(req.params.id)
        .then(() => {
            res.status(200).send("successfully deleted");
        })
        .catch((error) => {
            res.status(500).json(error);
        });
});

app.use((req, res) => {
    res.status(404).end('404 PAGE NOT FOUND');
});
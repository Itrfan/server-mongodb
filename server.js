const express = require("express");
// import mongoose
const mongoose = require("mongoose");

// setup an express app
const app = express();

// connect to MongoDB using Mongoose
async function connectToMongoDB() {
  try {
    // wait for the MongoDB to connect
    await mongoose.connect("mongodb://localhost:27017/netflix");
    console.log("MongoDB is Connected");
  } catch (error) {
    console.log(error);
  }
}

// trigger the connection with MongoDB
connectToMongoDB();

// declare schema for Movies
const movieSchema = new mongoose.Schema({
  title: String,
  director: String,
  release_year: Number,
  genre: String,
  rating: Number,
});

const showSchema = new mongoose.Schema({
  title: String, 
  creator: String,
  premiere_year: Number,
  seasons: Number,
  genre: String,
  rating: Number,
})

// create a Modal from the schema
const Movie = mongoose.model("Movie", movieSchema);

const Show = mongoose.model("Show", showSchema );

// setup root route
app.get("/", (req, res) => {
  res.send("Happy coding!");
});

// routes for movies
app.get("/movies", async (req, res) => {
  const director = req.query.director;
  const genre = req.query.genre
  const rating = req.query.rating;

  // create a empty container for filter
  let filter = {};
  // if director exists, then only add it into the filter container
  if (director) {
    filter.director = director;
  }
  if (genre) {
    filter.genre = genre;
  }
  if (rating) {
    filter.rating = rating;
  }
  // load the movies data from Mongodb
  const movies = await Movie.find(filter);
  res.send(movies);
});

app.get("/shows", async (req, res) => {
  const premiere_year = req.query.premiere_year;
  const genre = req.query.genre;
  const rating = req.query.rating;

  // create a empty container for filter
  let filter = {};
  // if director exists, then only add it into the filter container
  if (premiere_year) {
    filter.premiere_year = {$gt: premiere_year};
  }
  if (genre) {
    filter.genre = genre;
  }
  if(rating) {
    filter.rating = {$gt: rating}
  }
  // load the movies data from Mongodb
  const shows = await Show.find(filter);
  res.send(shows);
});

// start the express server
app.listen(5123, () => {
  console.log("server is running at http://localhost:5123");
});
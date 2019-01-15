require("dotenv").config();
const colors = require('colors');
const fs = require('fs');
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var dataArr = [];

var action = process.argv[2];
var parameter = process.argv[3];

function switchCase() {

    switch (action) {

        case 'concert-this':
            concertSearch(parameter);
            break;

        case 'spotify-this-song':
            spotifySearch(parameter);
            break;

        case 'movie-this':
            movieInfo(parameter);
            break;

        case 'do-what-it-says':
            doThings(parameter);
            break;

        default:
            console.log("I dont recognize that command... please try again.")
            break;

    }
};

function movieInfo(parameter) {

    if (process.argv[3]) {



        if (process.argv[2] === "movie-this") {

            var movieName = process.argv.splice(3, process.argv.length - 1);


            if (movieName === undefined) {
                console.log("movieName");
                parameter = "Mr. Nobody";
            }
            else {
                // Grab or assemble the movie name and store it in a variable called "movieName"
                // var movieName = process.argv.splice(3, process.argv.length - 1);

                var parameter = movieName;
                // ...
            }

            // Then run a request with axios to the OMDB API with the movie specified
            var queryUrl = "http://www.omdbapi.com/?t=" + parameter + "&y=&plot=short&apikey=trilogy";


            // This line is just to help us debug against the actual URL.
            // console.log(queryUrl);


            // Then run a request with axios to the OMDB API with the movie specified
            axios.get(queryUrl).then(
                function (movieInfo) {
                    // console.log(response.data);
                    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                    console.log("Here is some information about ".red +movieInfo.data.Title.red);
                    console.log("Title: ".red + movieInfo.data.Title.red);
                    console.log("Year: ".red + movieInfo.data.Year.red);
                    console.log("IMBD Rating: ".red + movieInfo.data.Ratings[0].Value.red);
                    console.log("Rotten Tomatoes Score: ".red + movieInfo.data.Ratings[1].Value.red);
                    console.log("Country: ".red + movieInfo.data.Country.red);
                    console.log("Language: ".red + movieInfo.data.Language.red);
                    console.log("Plot: ".red + movieInfo.data.Plot.red);
                    console.log("Starring ".red + movieInfo.data.Actors.red);
                    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                },
            )

            .catch(function (err) {
                console.log("Error: Could not find a movie by that name...".red);
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    
            });

            /// ------------------------------------------------------ ////    



        }

    }

    else {
        var parameter = "Mr. Nobody"
        var queryUrl = "http://www.omdbapi.com/?t=" + parameter + "&y=&plot=short&apikey=trilogy";

        axios.get(queryUrl).then(
            function (movieInfo) {
                // console.log(response.data);
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                console.log("You didn't enter a movie... so why don't you check out this one!".red);
                console.log("Title: ".red + movieInfo.data.Title.red);
                console.log("Year: ".red + movieInfo.data.Year.red);
                console.log("IMBD Rating: ".red + movieInfo.data.Ratings[0].Value.red);
                console.log("Rotten Tomatoes Score: ".red + movieInfo.data.Ratings[1].Value.red);
                console.log("Country: ".red + movieInfo.data.Country.red);
                console.log("Language: ".red + movieInfo.data.Language.red);
                console.log("Plot: ".red + movieInfo.data.Plot.red);
                console.log("Starring ".red + movieInfo.data.Actors.red);
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            },
        )

    }

};

function concertSearch(parameter) {


    if (process.argv[2] === "concert-this") {



        var artistName = process.argv.splice(3, process.argv.length - 1);


        var parameter = artistName;
        var queryUrl2 = "https://rest.bandsintown.com/artists/" + parameter + "/events?app_id=codingbootcamp&date=upcoming"
        // console.log(queryUrl2);
        axios.get(queryUrl2).then(
            function (artistInfo) {
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                console.log("Showing results for ".red + artistInfo.data[0].lineup[0].red + "...".red);
                console.log("Venue: ".red + artistInfo.data[0].venue.name.red);
                console.log("City: ".red + artistInfo.data[0].venue.city.red);
                console.log("Country: ".red + artistInfo.data[0].venue.country.red);
                console.log("Date of Event ".red + moment(artistInfo.datetime).format("MM/DD/YYYY").red);
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            },
        )
            .catch(function (error) {
                console.log("Error: Could not find any upcoming shows for this artist or artist not found".red);
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

            });
    }

};

function spotifySearch(parameter) {

    if (process.argv[2] === "spotify-this-song") {

        if (process.argv[3]) {

            var songName = process.argv.slice(3).join(" ");
            var parameter = songName;

            spotify.search({ type: 'track', query: parameter, limit: 10 }, function (err, data) {
                if (err) {
                    return console.log("Cannot find song on Spotify, please check your spelling and try again.".red);
                }
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                console.log("Here's some information about ".red + data.tracks.items[0].name.red + "...".red)
                console.log("Artist: ".red + data.tracks.items[0].album.artists[0].name.red);
                console.log("Title: ".red + data.tracks.items[0].name.red);
                console.log("URL: ".red + data.tracks.items[0].preview_url.red);
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

            }
            )
        }

        else {
            var parameter = "The Sign";
            spotify.search({ type: 'track', query: parameter, limit: 10 }, function (err, data) {
                if (err) {
                    return console.log("Cannot find song on Spotify, please check your spelling and try again.".red);
                }
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                console.log("You didn't type in a song... so check this one out!".red)
                console.log("Artist: ".red + data.tracks.items[9].album.artists[0].name.red);
                console.log("Title: ".red + data.tracks.items[9].name.red);
                console.log("URL: ".red + data.tracks.items[9].preview_url.red);
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

            }
            )

        }

    }

};

function doThings() {
    fs.readFile('random.txt', "utf8", function (error, data) {

        if (error) {
            return (error);
        }


        var dataArr = data.split(",");

        if (dataArr[0] === "spotify-this-song") {
            // console.log(dataArr);
            var songcheck = dataArr[1].trim().slice(1, -1);
            var parameter = songcheck;
            //   spotifySearch(parameter);
            spotify.search({ type: 'track', query: parameter, limit: 10 }, function (err, data) {
                if (err) {
                    return console.log("Cannot find song on Spotify, please check your spelling and try again.".red);
                }


                var result = {
                    artist: data.tracks.items[0].album.artists[0].name,
                    albumname: data.tracks.items[0].album.name,
                    song_name: data.tracks.items[0].name,
                    preview_url: data.tracks.items[0].preview_url
                }
                console.log("Here's some information about the song you chose...".red)
                console.log("Artist: ".red + data.tracks.items[0].album.artists[0].name.red);
                console.log("Title: ".red + data.tracks.items[0].name.red);
                console.log("URL: ".red + data.tracks.items[0].preview_url.red);

            }
            )
        }
        else if (dataArr[0] === "concert-this") {
            if (dataArr[1].charAt(1) === "'") {
                var dLength = dataArr[1].length - 1;
                var data = dataArr[1].substring(2, dLength);
                console.log(data);
                bandsInTown(data);
            }
            else {
                console.log("hey");
                var bandName = dataArr[1].trim().slice(1, -1);
                var parameter = bandName;
                var queryUrl2 = "https://rest.bandsintown.com/artists/" + parameter + "/events?app_id=codingbootcamp&date=upcoming"
                console.log(queryUrl2);
                axios.get(queryUrl2).then(
                    function (artistInfo) {
                        console.log(artistInfo.data[0]);
                        console.log("Venue: ".red + artistInfo.data[0].venue.name.red);
                        console.log("City: ".red + artistInfo.data[0].venue.city.red);
                        console.log("Country: ".red + artistInfo.data[0].venue.country.red);
                        console.log("Date of Event ".red + moment(artistInfo.datetime).format("MM/DD/YYYY").red);
                    },
                )
            }

        }
        else if (dataArr[0] === "movie-this") {
            var movie_name = dataArr[1].trim().slice(1, -1);


            var parameter = movie_name;
            // ...


            // Then run a request with axios to the OMDB API with the movie specified
            var queryUrl = "http://www.omdbapi.com/?t=" + parameter + "&y=&plot=short&apikey=trilogy";


            // This line is just to help us debug against the actual URL.
            // console.log(queryUrl);


            // Then run a request with axios to the OMDB API with the movie specified
            axios.get(queryUrl).then(
                function (movieInfo) {
                    // console.log(response.data);
                    console.log("Here is some information about your movie.".red);
                    console.log("Title: ".red + movieInfo.data.Title.red);
                    console.log("Year: ".red + movieInfo.data.Year.red);
                    console.log("IMBD Rating: ".red + movieInfo.data.Ratings[0].Value.red);
                    console.log("Rotten Tomatoes Score: ".red + movieInfo.data.Ratings[1].Value.red);
                    console.log("Country: ".red + movieInfo.data.Country.red);
                    console.log("Language: ".red + movieInfo.data.Language.red);
                    console.log("Plot: ".red + movieInfo.data.Plot.red);
                    console.log("Starring ".red + movieInfo.data.Actors.red);
                },
            )
            //   console.log(movie_name);
            //   movieInfo(movie_name);
        }

    });

};

switchCase();
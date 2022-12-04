//This project receive credit from class lecture

//First, load the things we need
var express = require('express');
const path = require('path');
var app = express(); //put new express app inside an app variable
const bodyParser  = require('body-parser');


// required module to make calls to a REST API
const axios = require('axios');

app.use(bodyParser.urlencoded());

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set("views", path.resolve(__dirname, "views"));



// index page 
app.get('/', function(req, res) {
    res.render("pages/index.ejs", {}); //first page for log in process form
});


  //check to see if user authorize to log in and view flight schedule
  //form request is in index page
  app.post('/process_login', function(req, res){
    var user = req.body.username;
    var password = req.body.password;

    if(user === '1' && password === '1') // if user enter correct input, this is condition  to check
    {
        res.render('pages/flights.ejs', {
            user: user,
            auth: true
        });
    } //lead to about page for login result
    else
    {
        res.render('pages/flights.ejs', {
            user: 'UNAUTHORIZED',
            auth: false
        });
    }
  });




  //            FLIGHT CUD OPERATION            /////

  //view all current schedule flights in flights page
  app.get('/flights', function(req, res) {

    //local API calls to my Python REST API 
    axios.all([axios.get('http://127.0.0.1:5000/api/flights/all'),
    axios.get('http://127.0.0.1:5000/api/planes/all'),
    axios.get('http://127.0.0.1:5000/api/airports/all')])
    .then(axios.spread((firstResponse, secondResponse, thirdResponse) => {
    
    let flights = firstResponse.data;
    let planes = secondResponse.data;
    let airports = thirdResponse.data;
    
    // use res.render to load up an ejs view file
    res.render('pages/flights.ejs', {
            flights : flights,
            planes : planes,
            airports :airports
        }); 
  }))
  .catch(error => console.log(error));
})
  

  // Add flight form
   
    app.post('/process_form_add_flight', function(req, res) {
        var planeid = req.body.planeid
        var airportfromid = req.body.airportfromid
        var airporttoid = req.body.airporttoid
        var date = req.body.date

    res.render ('pages/flight.ejs', {
      body: req.body,
      planeid : planeid,
      airportfromid : airportfromid,
      airporttoid : airporttoid,
      date : date
    })
  })


  // Delete flight form
  app.post('/process_form_delete_flight', function(req, res) {
    var id = req.body.id

    res.render ('pages/flights.ejs', {
      body: req.body,
      id : id
    })
  })


  //-------------- END FLIGHTS SECTION ------------------




   // ----------------CRUD OPERATIONS FOR PLANES ------------------//
  //view all planes in planes page
  app.get('/planes', function(req, res) {

    //local API call to my Python REST API 
    axios.get("http://127.0.0.1:5000/api/planes/all")
    .then((response)=>{
        
    var planes = response.data
    console.log(planes);
         // use res.render to load up an ejs view file
    res.render("pages/planes.ejs", {
            planes: planes
        });
    }); 
  });

 
  //add plane form
  app.post('/process_form_add_plane', function(req, res) {
    var make = req.body.make
    var model = req.body.model
    var capacity = req.body.capacity
    var year = req.body.year

    res.render ('pages/planes.ejs', {
      body: req.body,
      make : make,
      model : model,
      capacity : capacity,
      year : year
    })
  })

  //update plane
  app.post('/process_form_update_plane', function(req, res) {
    var make = req.body.make
    var model = req.body.model
    var capacity = req.body.capacity
    var year = req.body.year

    res.render ('pages/planes.ejs', {
      body: req.body,
      make : make,
      model : model, 
      capacity : capacity,
      year : year
    })
  })

  //delete plane
  app.post('/process_form_delete_plane', function(req, res) {
    var id = req.body.id

    res.render ('pages/planes.ejs', {
      body: req.body,
      id : id
  })
  })

  // -------------------END PLANES CRUD SECTION -------------





  // ----------------CRUD OPERATIONS FOR AIRPORTS ------------------//

  //view all airports in airports page
  app.get('/airports', function(req, res) {

    //local API call to my Python REST API that delivers cars
    axios.get("http://127.0.0.1:5000/api/airports/all")
    .then((response)=>{
        
    var airports = response.data
    console.log(airports);
         // use res.render to load up an ejs view file
    res.render("pages/airports.ejs", {
            airports: airports
        });
    }); 
  });

  //add an airport form
  app.post('/process_form_add_airport', function(req, res) {
    var airportcode = req.body.airportcode
    var airportname = req.body.airportname
    var country = req.body.country

    res.render ('pages/airports.ejs', {
      body: req.body,
      airportcode : airportcode,
      airportname : airportname,
      country : country
    })
  })

  //update plane
  app.post('/process_form_update_airport', function(req, res) {
    var airportcode = req.body.airportcode
    var airportname = req.body.airportname
    var country = req.body.country

    res.render ('pages/airports.ejs', {
      body: req.body,
      airportcode : airportcode,
      airportname : airportname,
      country : country
    })
  })

  //delete plane
  app.post('/process_form_delete_airport', function(req, res) {
    var id = req.body.id

    res.render ('pages/airports.ejs', {
      body: req.body,
      id : id
    })
  })

  // ---------------END AIRPORT SECTION ----------




app.listen(8080);
console.log('Access succesfully!');

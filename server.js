var express = require("express")
var fs = require("fs")

var app = express()

var format_date = function(date){
  var obj = new Date(date)
  var new_date = obj.toDateString()
  return new_date
}



app.use(express.static("public"))

app.get("/", function(request, response){
  response.sendFile(__dirname + '/views/index.html');
})

app.get("/:time", function(request, response){
  var input = request.params.time
  var moment = new Date()
  var text = "\nRequest made for '" + input +"'  at " + moment.toISOString() +"."
  fs.appendFile(".data/record.txt", text, function(err){
    if (err) {
      console.log("Failed to record access");
    } else {
      console.log("Logged access")
    }
  })
  
  var unix = null //default value
  var natural = null //default value
  if (isNaN(Date.parse(input)) == false){ //if the input can be parsed as a date string
    unix = Date.parse(input) / 1000 //Javascript time is 1000 times bigger.
    natural = format_date(input) //prettify the date
  } else if (new Date(input *1000).getTime() > 0){
      unix = input
      natural = format_date(input * 1000)
  }
  var output = {
    "unix_time" : unix,
    "natural_date" : natural
  }
  response.json(output) //send the completed json
})
        
app.listen(process.env.PORT)
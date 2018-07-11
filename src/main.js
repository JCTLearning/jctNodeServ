//main.js
//Import modules
var express = require("express");
var app = express();
var fs = require("fs"); //Pathing note, ./ puts us at main.js root dir... You would think I would realize that but I keep forgetting
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Main script
app.get("/", function(request, response){
  //Sets up our home page, to grab all requests.
  fs.readFile("./src/html/home.html", function(err, data){
    if(err) {
      console.log("error: "+String(err));
      response.end("error: "+String(err));
    }
    else {
      console.log("[-- Loading Main Page For User --]")
      response.end(data); //.end so that the pc stops
    }
  });

});
app.post("/api/login/", function(request, response){
  console.log("[-- User requested login --]");
  let username = request.body.username;
  let password = request.body.password;
  let userLoginFile = JSON.parse(fs.readFileSync("./data/login/login.json"));
  try{
    var nil = userLoginFile["login"][0][username]["password"]; //If this fails, the user doesn't exsist
    //If the user account exsists
    if(password==userLoginFile["login"][0][username]["password"]){
      //Login is a success
      let responseJson = '{"response" : {"0" : "Success","token" : "'+userLoginFile["login"][0][username]["token"]+'"}}';
      response.end(String(responseJson));
    }if(password!=userLoginFile["login"][0][username]["password"]){
      let responseJson = '{"response" : {"0" : "fail"}}';
      response.end(String(responseJson));
    }
  } catch(error) {
    //User accound doesn't exsist
    let responseJson = '{"response" : {"0" : "fail"}}';
    response.end(String(responseJson));
  }
});
app.post("/api/createlogin/", function(request, response){
  //This is where we'll create a user name and login for the users, while creating a 16 bit token
  let username = request.body.username;
  let password = request.body.password;
  //First check if user already exsist
  let loginFile = "./data/login/login.json"
  var loginData = fs.readFileSync(loginFile);
  loginData = JSON.parse(loginData);
  for(var i = 0; i < loginData['login'].length; i++){

    if(loginData["login"][i][username]!=undefined){
      userExsistOrNo = true;
    }
    else {
      userExsistOrNo = false;
    }
  }
  if (userExsistOrNo==true) {
    //User exsists
    returnString = '{"response" :{"0" : "UserExsists"}}';
    response.end(returnString);
  }
  if (userExsistOrNo == false) {
    //User does not exsist, create one
    //We need to add a check sum, to prevent user addition spam
    //Generate a token
    var token = "";
    var possibleLetters = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890!@#$%^&*()_=+{};'<,>.";
    for (var i =0; i < 16; i++){
      token = token + possibleLetters.charAt(Math.floor(Math.random() * possibleLetters.length));
    }
    let userPushData = JSON.parse('{"'+username+'":{"password" :"'+password+'","token" :"'+token+'"}}');
    loginData["login"].push(userPushData);
    //Update the login file with new creds
    fs.writeFile(loginFile, JSON.stringify(loginData), function(err){if(err){console.log("[-- "+String(err)+" --]");}});
    let reply = '{"response" : {"0" : "Success","token" : '+token+'}}';
    response.end(reply);
  }
});
app.get("/details/api_docs", function(request, response){
  //This is where we will display the api docs
  fs.readFile("./src/html/details/apiDocs.html", function(err, data){if(err){console.log("[--Error: "+err+" --]");}else{console.log("[-- Loading API docs for user --]");response.end(data);}});
});
app.get("/details/our_server", function(request, response){
  //This is where we will display the api docs
  fs.readFile("./src/html/details/serverInfo.html", function(err, data){if(err){console.log("[--Error: "+err+" --]");}else{console.log("[-- Loading API docs for user --]");response.end(data);}});
});
//Apparently this needs to host its own fonts. Uggggg
app.get("/fonts/q&=:font", function(request, response){
  var fontName = request.params.font; //Grab the name of the font file
  var pathing = "./src/html/assets/"+String(fontName)+".ttf";

  //Read the file and return  it.
  fs.readFile(pathing, function(err, data){
    if(err) {
      console.log("error: "+String(err));
      response.end("error: "+String(err));
    }
    else {
      //console.log("[-- Loading Fonts --]") //Is too much clutter
      response.end(data);
    }
  });
});
//Okay put the flag catcher at the bottom... It seems node.js checks through .get in order of apperances. So if we put '*' before '/path', people will never get /path because * is avalible.
//Look just put it at the bottom.
app.get("*", function(request, response){
  console.log("[-- User Attempted To Load Unindexed Command : Unindexed Command = "+String(request.url)+" --]")

  //Will catch any unindexed get requests
  response.redirect("/"); //return home
});

app.listen("80", "127.0.0.1", function(){
  console.log("[-- Started --]");
})

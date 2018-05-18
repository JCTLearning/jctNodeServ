//main.js
//Import modules
var express = require("express");
var app = express();
var fs = require("fs"); //Pathing note, ./ puts us at main.js root dir... You would think I would realize that but I keep forgetting
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
app.get('/api/login/:loginString', function(request, response){
		var loginString = request.params.loginString;
		var userCreds = loginString.split("-");
		console.log(userCreds);
		
	}	
);
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
})
app.listen("3000", "127.0.0.1", function(){
  //console.log("[-- Started --]");
})

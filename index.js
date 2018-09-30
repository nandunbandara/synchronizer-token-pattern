const 
    express = require('express'),
    cookieParser = require('cookie-parser'),
    
    app = express(),

    PORT = 9090;

// middleware
// TODO: set middleware in app/middleware.js
app.use(cookieParser());


// TODO: add routes

app.listen(PORT, err => {
    if(err){
        console.log('ERROR: Could not start server on port ', PORT);
        return;
    }

    console.log('SUCCESS: Started server on port ', PORT);

})
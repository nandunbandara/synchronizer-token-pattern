const 
    express = require('express'),
    cookieParser = require('cookie-parser'),
    randomBytes = require('random-bytes'),
    bodyParser = require('body-parser'),
    
    constants = require('./app/constants'),
    
    app = express(),

    PORT = 9090;

// middleware
// TODO: set middleware in app/middleware.js
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

const SESSION_DATA = {};

// default route : check if a session is active
app.get('/', (req, res) => {

    let session_id = req.cookies['session-id'];

    if(session_id && SESSION_DATA[session_id]){
        res.sendFile('public/form.html', { root: __dirname });
    } else {
        res.sendFile('public/login.html', { root: __dirname});
    }
    
});

// handle user login and token generation
app.post('/login', (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    // validate user input
    if(username === undefined || username === ""){
        res.status(400).json({ success:false, message: "Username undefined"});
        return;
    }

    if(password === undefined || password === ""){
        res.status(400).json({ success:false, message: "Password undefined"});
        return;
    }

    if(username === constants.username && password === constants.password){

        // generate session info
        let session_id = Buffer.from(randomBytes.sync(32)).toString('base64');
        let csrf_token = Buffer.from(randomBytes.sync(32)).toString('base64');

        // saving session info
        SESSION_DATA[session_id] = csrf_token;

        res.setHeader('Set-Cookie', [`session-id=${session_id}`, `time=${Date.now()}`]);
        res.sendFile('public/form.html', { root: __dirname });
    }else {
        res.status(405).json({ success:false, message:"Unauthorized user"});
        res.redirect('/');
    }
})

app.post('/post', (req, res) => {
    
    let session_id = req.cookies['session-id'];

    if(session_id && SESSION_DATA[session_id] && (SESSION_DATA[session_id] === req.body.csrf_token)){
        res.status(200).json({success:true});
    } else {
        res.status(400).json({ success:false });
    }

});

// get token 
app.get('/token', (req, res) => {

    let session_id = req.cookies['session-id'];

    console.log('cookies: ', req.cookies);

    if(session_id && SESSION_DATA[session_id]){

        res.status(200).json({ success:true, token: SESSION_DATA[session_id]});

    } else {

        res.status(400).json({ success:false, message: 'Token unavailable'});

    }
})

app.listen(PORT, err => {
    if(err){
        console.log('ERROR: Could not start server on port ', PORT);
        return;
    }

    console.log('SUCCESS: Started server on port ', PORT);

})
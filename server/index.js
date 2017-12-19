import { fail } from 'assert';

const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `./controllers/messages_controller` );
const session = require('express-session');
const createIntialSession = require('./middlewares/session');
const filter = require('./middlewares/filter');
require('dotenv').config();

const app = express();

app.use( bodyParser.json() );
app.use( express.static( `${__dirname}/../build` ) );

app.use(session({
    resave: false,
    secret: process.env.secret,
    saveUninitialized: true,
    cookie:{
        maxAge: 10000
    }
}))

app.use(createIntialSession);
app.use((req, res, next)=>{
  if(req.method === "POST" || req.method === "PUT"){
      filter();
  }else{
      next();
  }  
})

const messagesBaseUrl = "/api/messages";
app.post( messagesBaseUrl, mc.create );
app.get( messagesBaseUrl, mc.read );
app.put( `${messagesBaseUrl}`, mc.update );
app.delete( `${messagesBaseUrl}`, mc.delete );
app.get('/api/messages/history', mc.history);

const port = process.env.PORT || 3000
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );
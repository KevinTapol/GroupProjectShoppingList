// Server.js runs on startup and requires all mvc and middleware acting as both controller and router. As controller, it acts as the brain that controlls the application. As router, it inherits all routing from the router directing from home url to files in folders shown in our dependancies below.
const express = require('express')
const app = express()
// mongoose connects to mongodb allowing us to use understandable methods
const mongoose = require('mongoose')
// passport.js is acting as user authentication
const passport = require('passport')
// stores user cookie for user sessions localy on client side for a set duration
const session = require('express-session')
// stores user sessions in a collection on MongoDB for a set duration
const MongoStore = require('connect-mongo')(session)
// flash is being used as a message success/warning/error system 
const flash = require('express-flash')
// morgan can access all the information from an HTTP request and response via custom tokens
const logger = require('morgan')
// require function that allows us to connect to our database
const connectDB = require('./config/database')
//This is where server.js acts as a router setting up routes telling our server where to direct traffic to the appropriate router which is going to send it to the appropriate controller
// declared variable directing to the main.js file in the routes folder
const mainRoutes = require('./routes/main')
// declared variable directing to the todos.js in the routes folder
const todoRoutes = require('./routes/todos')

// initializing our hidden path .env and guiding to the .env file in config folder
require('dotenv').config({ path: './config/.env' })

// Passport config
require('./config/passport')(passport)
// This is where we call the function connectDB() to connect to our DB which is from our config folder database
connectDB()
// templating langquage aka view engine that renders our html
app.set('view engine', 'ejs')
// sets location for static assests in the public folder for client side rendering images, css, and js event listeners
app.use(express.static('public'))
// replaces body-parser
// parses incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }))
// parses JSON content from incoming requests
app.use(express.json())
// express morgan middleware
app.use(logger('dev'))

// Sessions
// creates and stores user login in the database as a collection named sessions
// we should put the secret in the .env file 
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
)

// Passport middleware
// helps with authentication and cookies
app.use(passport.initialize())
app.use(passport.session())

// Initialize express flash messages
app.use(flash())

// Server.js is acting as a router listening to user url going to home page '/' calls the variable declared at the beginning of server.js directing us to main.js in routes folder
app.use('/', mainRoutes)
// server.js acting as router listening on user url '/todos' and calling declared variable to go to todo.js in routes folder
app.use('/todos', todoRoutes)

// initialize or setting up our port in this case localhost:5500 found in .env file
app.listen(process.env.PORT, () => {
  console.log(`Server is running, you better catch it on localhost:${process.env.PORT}!`)
})
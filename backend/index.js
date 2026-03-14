// initialise
const express=require('express')
const app=express()
const cors=require('cors')
const dotenv=require('dotenv')
const urlHandler=require('./api/url')
const authHandler=require('./api/auth')
// get prisma client
const { PrismaClient } = require("@prisma/client");

dotenv.config();

// initialise prisma
const prisma = new PrismaClient();

const port = 3000;
app.use(cors());
// json parsing
app.use(express.json());
app.use('/',urlHandler(prisma))
app.use('/auth',authHandler(prisma))

app.listen(port, () => {
  console.log("Server running on port", port);
});

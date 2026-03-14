const express=require('express')
const router=express.Router()
const jwt = require("jsonwebtoken");
const secret='aaslfbhkafgfhqkweubvsbgbasdiqh5vmcghnftdrykutl'

function urlString(length){
    const base='abcdefghijklmnopqrstuvwxysABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    let result=''
    for(let i=0;i<length;i++){
        const randomIndex = Math.floor(Math.random() * base.length);
        result += base[randomIndex];
    }
    return result
}

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("HEADER:", authHeader);

    if (!authHeader) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, secret);

    req.user_id = decoded.id;

    next();

  } catch (err) {
    console.log(err);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = (prisma) =>{
    router.post("/create-url", async(req,res) => {
        try{ 
        const {url,user_id}=req.body;
        console.log(url)
        //  add validation
        let new_url='';
        let exists=true;
        while(exists){
          new_url=urlString(6);
          const check=await prisma.short_url_mapping.findUnique({where: { short_url: new_url }})
          if(!check){exists=false}
        }
        // const exist=await prisma.short_url_mapping.findUnique({where:{real_url:url}})
        const created=await prisma.short_url_mapping.create({
            data:{
                short_url : new_url,
                real_url :  url,
                user_id: user_id
            }
        })
        return res.json(created);
        }catch(e){
            console.log(e)
            return res.status(500).json({
                error: "Internal Server Error"
            });
        }
    })

    router.get("/urls",authMiddleware, async (req, res) => {
    try {
        
        console.log(req.user_id)
        const urls = await prisma.short_url_mapping.findMany({
        where: { user_id:req.user_id }
        });

        res.json({ urls });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
    });
    
    router.get("/:code", async (req, res) => {
        const { code } = req.params;

        const url = await prisma.short_url_mapping.findUnique({
            where: { short_url: code }
        });
        console.log(url)

        if (!url) {
            return res.status(404).json({ msg: "URL not found" });
        }

        res.redirect(url.real_url);
    });

    

    return router
}
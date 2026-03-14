const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router=express.Router()
const secret='aaslfbhkafgfhqkweubvsbgbasdiqh5vmcghnftdrykutl'

module.exports = (prisma) =>{
    
    router.post("/sign-up", async (req,res)=>{
        try{
            const {email,password}=req.body
            if(!email || !password){
                return res.status(400).json({ msg: "Enter full details" });
            }
            const existingUser=await prisma.users.findUnique({where: {email}})
            if(existingUser){
                return res.status(400).json({ msg: "User Already exists" });
            }
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.users.create({
                data: {
                    email,
                    password: hashedPassword
                }
            });

            res.status(201).json({ msg: "User created", user });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    })
    router.post("/log-in",async (req,res) =>{
        try{
            const {email,password}=req.body
            if(!email || !password){
                return res.status(400).json({ msg: "Enter full details" });
            }
            const existingUser=await prisma.users.findUnique({where: {email}})
            if(!existingUser){
                return res.status(400).json({ msg: "User does not exist" });
            }
            const isMatch = await bcrypt.compare(password, existingUser.password);

            if (!isMatch) {
                return res.status(401).json({ msg: "Invalid password" });
            }

            // Generate JWT
            const token = jwt.sign(
                { id: existingUser.id, email: existingUser.email },
                secret,
                { expiresIn: "7d" }
            );
            res.json({
                msg: "Login successful",
                token
            });


        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    })
    
    return router
}
import { Auth, RequestErrorHandling, currentUser, generateToken, refreshToken } from "@yaanetechjwt/auth"
import expresss from "express"
import * as dotenv from "dotenv"
import cookieSession from "cookie-session"


const app = expresss()

app.use(expresss.json())

dotenv.config()


app.set("trust proxy",1)

app.use(cookieSession({
  secure:false,
  signed:false
}))


app.get("/current", currentUser,Auth,(req,res)=>{
    res.send(req.currentUser)
})

app.post("/login", async (req,res)=>{
    const {email,password} = req.body 
    let payload = {email,password}
    let data = {
       payload:payload,
       session: true,
       secret_key:process.env.JWT_AUTH,
       expireIn:"15s",
       refresh_token_expireIn:"150s"
    }
 
   const token = await generateToken(req,data)
   res.send(token)
})


app.get('/refresh_token', (req,res)=>{
    let token = refreshToken(req,"25s",true);
    return res.send(token)
 })

app.use(RequestErrorHandling)



const startapp = ()=>{
    app.listen(3000,()=>{
        console.log('port is listening');
    })
}

startapp()
function verifyToken (req,res,next){
    const bearerHeader=req.headers['authorization']
    // console.log(bearerHeader);
    if(typeof bearerHeader!== "undefined"){
        const bearer=bearerHeader.split(' ')
        const token=bearer[1];
        req.token=token
        next()
    }
    else{
        console.log("in verifyToken: Token is empty")
        res.status(403).send("Error")
    }
}

module.exports = {verifyToken};
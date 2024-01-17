const verifyBook = (image,title,description,price)=>{
    if( !image || !title || !description  ||  !price )
        return {state:false , msg:"image,title,description and price are required"}
    if( title.length <= 7)
        return {state:false , msg:"title must contains at least 7 caracters "}
    if( description.length <= 10)
        return {state:false , msg:"description must contains at least 10 caracters "}
    if( price < 5 ||  price > 500 )
        return {state:false , msg:"price must be bwtween 5 and 500 dollars ($) "}
        
        return {state:true , msg:""}
}
const middleWareVerfication = (req,res,next)=>{
    let {image,title,description,price} = req.body 
    let {state,msg} = verifyBook(image,title,description,price)
    if(state)
        return next()
    res.status(400).send(msg)
}
module.exports = {
    verifyBook,middleWareVerfication
}

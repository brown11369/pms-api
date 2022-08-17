const http=require("http");
const fs=require("fs");
const url=require("url");
const PORT = process.env || 8000;


const server=http.createServer((req,res)=>{

    let parsedurl=url.parse(req.url,true)
    let products=fs.readFileSync("./products.json",{encoding: "utf-8"})
    let parseproducts = JSON.parse(products)
    let id=parsedurl.query.id;

    
    
    if(req.method==="GET" && parsedurl.pathname==="/products")
    {
        if(id===undefined)
        {
            res.write(products)
            res.end()
        }
        else{

            let product = parseproducts.find((product,index)=>{
                return Number(id)===Number(product.id)
            })
            res.write(JSON.stringify(product))
            res.end()
     
        }
        
    }
    else if(req.method==="DELETE" && parsedurl.pathname==="/products")
    {

        if(id!==undefined)
        {
            let delproduct=parseproducts.findIndex((product,index)=>{
                return Number(id)===Number(product.id)
            })
            if(delproduct!==-1){

                parseproducts.splice(delproduct,1)

                fs.writeFile("./products.json",JSON.stringify(parseproducts),(err)=>{

                    if(err===null)
                    {
                        res.write(JSON.stringify({message:"Product delete"}))
                        res.end()
                    }
                    else
                    {
                        res.write(JSON.stringify({message:"facing some issue try again later"}))
                        res.end()

                    }
                })

            }
            else
            {
                res.write(JSON.stringify({message:"Invalid id"}))
                res.end()
            }
            

        }
        else{
            res.write(JSON.stringify({message:"Can't find id"}))
            res.end()
        }
    }
    else if(req.method==="POST" && parsedurl.pathname==="/products")
    {
        let data=""
        req.on("data",(chunck)=>{
            data+=chunck;
        })
        req.on("end",()=>{
            let getdata=JSON.parse(data)
            parseproducts.push(getdata)

            fs.writeFile("./products.json",JSON.stringify(parseproducts),(err)=>{

                if(err===null)
                {
                    res.write(JSON.stringify({message:"Created Product"}))
                    res.end()
                }
                else
                {
                    res.write(JSON.stringify({message:"facing some issue try again later"}))
                    res.end()

                }
            })



        })
    }
    else if(req.method==="PUT" && parsedurl.pathname==="/products")
    {
        
        if(id!==undefined){
            let data="";
            req.on("data",(chunck)=>{
            data+=chunck;
            })

            req.on("end",()=>{
                let getproduct=parseproducts.findIndex((product,index)=>{
                    return Number(id)===Number(product.id)
                })
                parseproducts[getproduct]=JSON.parse(data);

                fs.writeFile("./products.json",JSON.stringify(parseproducts),(err)=>{

                    if(err===null)
                    {
                        res.write(JSON.stringify({message:"update Product"}))
                        res.end()
                    }
                    else
                    {
                        res.write(JSON.stringify({message:"facing some issue try again later"}))
                        res.end()
    
                    }
                })



            })
        }
        else{
            res.write(JSON.stringify({message:"Can't find id"}))
            res.end()
        }
        
    }




})


server.listen(PORT,()=>{
    console.log(`Server up and running ${PORT}`)
})
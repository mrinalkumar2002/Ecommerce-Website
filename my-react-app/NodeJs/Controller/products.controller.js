import mongoose from "mongoose"
import Product from "../Model/products.model.js"

export const saveData=async(req,res)=>{
    try{
        const response= await fetch("https://dummyjson.com/products") //fetch data from external api
        const data= await response.json();
        console.log(data)

        if(!data || !data.products || !data.products.length===0){ // check where the data is present or not
        
            return res.status(404).json({
                message:"Product not found" // handle error if product is not found
            })
        }
    const productsTosave = data.products.map(item => ({
    images: item.images,
    title: item.title,
    description: item.description,
    price: item.price,
    stock: item.stock
}));
        const savedProducts =await Product.insertMany(productsTosave) //save products to  mongodb
        res.status(200).json({
            message:"Product is successfully added" //data is successfully fetched
        })
    }
    catch(error){
        res.status(500).json({
            message:error.message //handle error
        })
    }   
}
 export const getProducts = async (req, res) => {
    try {
        const products = await Product.find(); // fetch all products
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getProductID = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



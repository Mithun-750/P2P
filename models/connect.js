const mongoose = require("mongoose");
mongoose.set("strictQuery",true);
async function connecttomongodb(url){
return mongoose.connect(url)
}
module.exports={connecttomongodb}
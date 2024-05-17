const mongoose=require( 'mongoose');
const search_schema = new mongoose.Schema({
    game_name: {
      type: String,
    },
  
    category: {
      type: String,
    },
  
    description: {
      type: String,
    },
  
    clips: [
      {
        url: String,
      },
    ],
    price: {
      type: Number,
   },
   rating: {
      type: Number,
      default:0,
    },
    reviews: [
      {
        name: String,
        rating: Number,
        review: String,
      },
    ],
  });
  
const game_details = mongoose.model("game_details", search_schema);
module.exports=game_details;
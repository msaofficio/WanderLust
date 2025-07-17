const mongoose = require("mongoose");
const reviews = require("./reviews");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: {
    type: String,
  },
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1621873493031-d871c4e49d61?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ybmh1YnxlbnwwfHwwfHx8MA%3D%3D",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1621873493031-d871c4e49d61?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ybmh1YnxlbnwwfHwwfHx8MA%3D%3D"
        : v,
  },
  price: { type: Number },
  location: { type: String },
  country: { type: String },
  reviews:[{type: Schema.Types.ObjectId, ref: 'Review'}],
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;

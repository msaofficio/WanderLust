const express = require("express");
const app = express();
const path = require("path");
const meth = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(meth("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("root working");
});

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
});

app.get("/listings/new", async (req, res) => {
  res.render("./listings/new.ejs");
});

app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/show.ejs", { listing });
});

app.post("/listings", async (req, res) => {
  let { title, description, image, price, location, country } = req.body;
  await Listing.insertOne({
    title: title,
    description: description,
    image: image,
    price: price,
    location: location,
    country: country,
  });
  res.redirect("/listings");
});

app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  // console.log(id);
  const listing = await Listing.findById(id);
  // console.log(listing);
  res.render("./listings/edit.ejs", { listing });
});

app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let {
    title: title,
    description: description,
    image: image,
    price: price,
    location: location,
    country: country,
  } = req.body;
  // console.log(id);
  await Listing.findByIdAndUpdate(id, {
    title: title,
    description: description,
    image: image,
    price: price,
    location: location,
    country: country,
  });
  res.redirect("/listings");
});

app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

app.listen(8080, () => {
  console.log("server listening on port 8080");
});

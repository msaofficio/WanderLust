const express = require("express");
const app = express();
const path = require("path");
const meth = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const asyncWrap = require("./utils/asyncWrap.js");
const expresserror = require("./utils/errorr.js");
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

//INDEX ROUTE
app.get(
  "/listings",
  asyncWrap(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  })
);

//NEW ROUTE
app.get(
  "/listings/new",
  asyncWrap(async (req, res) => {
    res.render("./listings/new.ejs");
  })
);

//SHOW ROUTE
app.get(
  "/listings/:id",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", { listing });
  })
);

//CREATE ROUTE
app.post(
  "/listings",
  asyncWrap(async (req, res, next) => {
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
  })
);

//EDIT ROUTE
app.get(
  "/listings/:id/edit",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    // console.log(id);
    const listing = await Listing.findById(id);
    // console.log(listing);
    res.render("./listings/edit.ejs", { listing });
  })
);

//UPDATE ROUTE
app.put(
  "/listings/:id",
  asyncWrap(async (req, res) => {
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
  })
);

//DELETE ROUTE
app.delete(
  "/listings/:id",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

app.all('*rest', (req, res) => { res.status(404).send('Not found'); });

//MIDDLEWARE for handling the server side validations error if occured
app.use((err, req, res, next) => {
  let { status, message } = err;
  res.status((status)).send((message));
  // res.send("Something wen wrong");
});

app.listen(8080, () => {
  console.log("server listening on port 8080");
});

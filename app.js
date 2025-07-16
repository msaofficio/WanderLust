const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const meth = require("method-override");
const ejsMate = require("ejs-mate");
const asyncWrap = require("./utils/asyncWrap.js");
const expresserror = require("./utils/errorr.js");
const { listingSchema, reviewSchema } = require("./schema.js");

const Review = require("./models/reviews.js");

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

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expresserror(400, errMsg);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expresserror(400, errMsg);
  } else {
    next();
  }
};

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
  validateListing,
  asyncWrap(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
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
  validateListing,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // console.log(id);
    res.redirect(`/listings/${id}`);
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

// REVIEW ROUTE
app.post(
  "/listings/:id/reviews",
  validateReview,
  asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    // console.log(req.body)
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("Review added successfully");
    res.redirect(`/listings/${listing._id}`);
  })
);

app.all("*rest", (req, res) => {
  res.status(404).send("Not found");
});

//MIDDLEWARE for handling the server side validations error if occured
// app.use((err, req, res, next) => {
//   let { status, message } = err;
//   res.status(status).send(message);
//   // res.send("Something wen wrong");
// });

app.listen(8080, () => {
  console.log("server listening on port 8080");
});

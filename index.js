require("dotenv").config();
// const functions = require("firebase-functions");
// const { onRequest } = functions.https;
// const logger = require("firebase-functions/logger");

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5500;

app.use(
  cors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(express.json());
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// console.log("Stripe Key:", stripe._api.auth);
// console.log("Stripe Secret Key:", stripe._api.auth.split(" ")[1]);

app.get("/", (req, res) => {
  res.send("Hello from the test server!");
});
app.post("/payments/create", async (request, response) => {
  // const total = request.query.total;
  // console.log("Request Body:", request.query);
  const total = request.body.total;
// if (typeof total !== "number" || total < 1) {
//   return response.status(400).send("Invalid total amount");
// }
  // const total = request.body.total || request.query.total;rs

  console.log("Payment Request Recieved for this amount >> ", total);
  // console.log(
  //   "Payment Request Received for this amount from body >> ",
  //   request.body.total
  // );
  // const amount = Math.round(total * 100);
  // amount = 100
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    // amount: amount,
    currency: "usd",
  });

  console.log("Sending to Stripe. Amount:", total);

  console.log("Generated clientSecret:", paymentIntent.client_secret);
  // OK - Created
  try {
    response.status(201).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    response.status(500).send("Internal Server Error");
  }
});

// Define other routes or functions here

// - Listen command
// exports.api = onRequest(app);
app.listen(port, () => {
  console.log(`Server listening at port http://localhost :${port}`);
});



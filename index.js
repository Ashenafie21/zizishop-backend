require('dotenv').config();
const functions = require("firebase-functions");
const { onRequest } = functions.https;
const logger = require("firebase-functions/logger");

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json());
// const stripe = require("stripe")(
//   "sk_test_51OPvWsE20rTG9mx1KKv9GTSFu34VzjajZskvUKB12qyhHJoLf2dALrDsR667EHa2we0wVHlaUzoBOmoJY4wKqyyO00EC98Rir2"
// );
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.get("/", (req, res) => {
  res.send("Hello from the test server!");
});
app.post("/payments/create", async (request, response) => {
  const total = request.query.total;

  console.log("Payment Request Recieved for this amount >>> ", total);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total, // subunits of the currency
    currency: "usd",
  });

  // OK - Created
  response.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});

// Define other routes or functions here

// - Listen command
// exports.api = onRequest(app);
app.listen(port, ()=>{
  console.log(`Server listening at port http://localhost :${port}`);
})



const soap = require("soap");

module.exports = (req, res, next) => {
  try {
    const amount = "10000"; //from Trade Management service (orderID)
    const description = "تراکنش آزمایشی"; //from Trade Management service (orderID)
    const payment_url = process.env.PAYMENT_URL;
    const callback_url =
      "http://" +
      process.env.HOST +
      ":" +
      process.env.PORT +
      "/accountico/pay/callback/" +
      req.transactionID +
      "/";
    var options = {
      MerchantID: process.env.MERCHANT_ID,
      Amount: amount,
      Description: description,
      Email: req.email,
      Mobile: "",
      CallbackURL: callback_url,
    };
    console.log(options);
    soap.createClient(payment_url, (err, client) => {
      client.PaymentRequest(options, (err, result) => {
        var body = JSON.parse(JSON.stringify(result));
        if (Number(body.Status) === 100) {
          req.paymentStatus = body.Status;
          req.paymentAuthority = body.Authority;
          console.log(body);
          next();
        } else {
          res.status(Number(body.Status)).json(body);
        }
      });
    });
  } catch {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

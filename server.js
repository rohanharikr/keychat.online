const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const transactionsRoutes = require("./routes/transactions");
require("dotenv").config();
const path = require('path')

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongodb database is connected"))
  .catch((err) => console.log(err));

app.use("/api/transactions", transactionsRoutes);

if(process.env.NODE_ENV === 'production'){
	app.use(express.static('client/public'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'))
	})
}

app.listen(process.env.PORT, () => {
  console.log(`express is running at ${process.env.PORT}`);
});

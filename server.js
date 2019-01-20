const express = require("express");

const linkedinCtl = require("./controllers/linkedin.ctl");
const unsplashCtl = require("./controllers/unsplash.ctl");

const app = express();
const port = process.env.PORT || 3000;
app.set("port", port);

app.use("/", express.static("./public")); // for API

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With, Content-Type, Accept"
  );
  res.set("Content-Type", "application/json");
  next();
});

/*** All routes ***/
app.get("/authorize", linkedinCtl.linkedinConnect);
app.get("/photos", unsplashCtl.getphotos);
app.get("/callback", linkedinCtl.callback);
app.get("/check", (req, res) => {
  res.send("back in server");
});

app.listen(port, () => console.log(`listening on port ${port}`));

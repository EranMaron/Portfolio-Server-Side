const express = require("express"),
  Parser = require("body-parser");

const linkedinCtl = require("./controllers/linkedin.ctl"),
  unsplashCtl = require("./controllers/unsplash.ctl"),
  profileCtl = require("./controllers/profile.ctl"),
  youtubeCtl = require("./controllers/youtube.ctl");

const app = express();
const port = process.env.PORT || 3000;
app.set("port", port);

app.use(Parser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With, Content-Type, Accept"
  );
  res.set("Content-Type", "application/json");
  next();
});

/* Routes */
app.get("/", linkedinCtl.linkedinConnect); // Loging in with Linkedin- route will automatically redirect to "/authorize"
app.get("/authorize", linkedinCtl.getAccessToken, linkedinCtl.setAccessToken); // Authorizing Linkedin connection- route will automatically redirect to "/questions
app.get("/cancelled", linkedinCtl.cancellErr); // Cancelletion page
app.post("/questions", unsplashCtl.getphotos); // Answering questions and sending the answers as POST request- route will automatically redirect to "/showProfile
app.get("/videos", youtubeCtl.getVideos);
app.get("/chooseVideos", youtubeCtl.chooseVideos);
app.get("/getVideoDetails", youtubeCtl.getVideoDetails);
app.get("/showProfile", profileCtl.showProfile); //Showing User profile
app.put("/updateSummary", profileCtl.updateSummary); // Updating summary field in User profile- route will automatically redirect to "/showProfile

app.listen(port, () => console.log(`listening on port ${port}`));

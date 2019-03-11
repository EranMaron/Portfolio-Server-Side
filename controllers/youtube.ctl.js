const axios = require("axios"),
  consts = require("../consts.js"),
  errorObj = require("../errorObj"),
  User = require("../models/user"),
  Video = require("../models/video");

const { YOUTUBE_KEY } = consts;

const axiosCreate = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    part: "snippet",
    maxResults: 10,
    key: YOUTUBE_KEY
  }
});

saveToDB = async (videos, _id) => {
  let id = _id;

  for (let i = 0; i < videos.length; i++) {
    let videoId = videos[i].id;
    await Video.findOne({ id: videoId }, (err, result) => {
      if (err) {
        console.log(`error occurred- ${err}`);
        return res.json(errorObj(404, err));
      }

      if (!result) {
        const video = new Video({
          id: videos[i].id,
          title: videos[i].title,
          description: videos[i].description,
          thumbnail: videos[i].thumbnail
        });

        video.save(err => {
          if (err) {
            console.log(`error occurred- ${err}`);
            res.json(errorObj(404, err));
          } else {
            console.log(`Saved video with video id ${videoId} to Data Base`);
          }
        });
      }

      User.findOne({ id: id }, (err, result) => {
        if (err) {
          console.log(`error occurred- ${err}`);
          res.json(errorObj(404, err));
        } else if (result) {
          result.videos.push(`${videoId}`);
          result.save(err => {
            if (err) {
              console.log(`error occurred- ${err}`);
              res.json(errorObj(404, err));
            }
          });
        } else {
          console.log(`User document not found`);
          res.json(errorObj(404, `User document not found`));
        }
      });
    });
  }
};

module.exports = {
  async getVideos(req, res) {
    let videos = new Array();
    let videosToPresent = new Array();

    term = req.query.term;
    id = req.query.id;

    if (id === undefined) {
      return res.json(errorObj(404, `Send id as parameter`));
    }

    const response = await axiosCreate
      .get("/search", {
        params: {
          q: term
        }
      })
      .catch(err => {
        console.log(`error occurred- ${err}`);
        res.json(errorObj(404, err));
      });

    for (let i = 0; i < response.data.items.length; i++) {
      let videoId = response.data.items[i].id.videoId;

      let videoObj = {
        id: videoId,
        title: response.data.items[i].snippet.title,
        description: response.data.items[i].snippet.description,
        thumbnail: response.data.items[i].snippet.thumbnails.medium.url
      };

      if (videoId === undefined) continue;

      videos.push(videoObj);
      videosToPresent.push(`https://www.youtube.com/watch?v=${videoId}`);
    }

    res.json(videosToPresent);
    saveToDB(videos, id);
  },
  async chooseVideos(req, res) {
    //choices sent as choices param (Array) as get request
    let choices = req.query.coices;
    let id = req.query.id;
    let videos = new Array();

    if (id === undefined) {
      return res.json(errorObj(404, `Send id as parameter`));
    }

    let result = await User.findOne({ id: id }, (err, result) => {
      if (err) {
        console.log(`error occurred- ${err}`);
        res.json(errorObj(404, err));
      }
    });

    videos = result.videos;

    let choicesArray = new Array();
    for (let i = 0; i < choices.length; i++) {
      let index = choices[i];
      choicesArray.push(videos[index]);
    }

    await User.updateOne(
      { id: id },
      { $set: { videos: choicesArray } },
      (err, result) => {
        if (err) {
          console.log(`error occurred- ${err}`);
          res.json(errorObj(404, err));
        } else {
          console.log(`Videos updated according to user's choice`);
          res.json(errorObj(200, `Choices Saved to DB`));
        }
      }
    );
  },
  async getVideoDetails(req, res) {
    let videoId = req.query.id;

    if (videoId === undefined) {
      return res.json(errorObj(404, `Send Video id as parameter`));
    }

    await Video.findOne({ id: videoId }, (err, result) => {
      if (err) {
        console.log(`error occurred- ${err}`);
        res.json(errorObj(404, err));
      } else {
        res.json(result);
      }
    });
  }
};

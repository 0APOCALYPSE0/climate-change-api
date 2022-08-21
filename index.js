const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const newsPapers = [
  {
      name: 'cityam',
      address: 'https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/',
      base: ''
  },
  {
      name: 'thetimes',
      address: 'https://www.thetimes.co.uk/environment/climate-change',
      base: ''
  },
  {
      name: 'guardian',
      address: 'https://www.theguardian.com/environment/climate-crisis',
      base: '',
  },
  {
      name: 'telegraph',
      address: 'https://www.telegraph.co.uk/climate-change',
      base: 'https://www.telegraph.co.uk',
  },
  {
      name: 'nyt',
      address: 'https://www.nytimes.com/international/section/climate',
      base: '',
  },
  {
      name: 'latimes',
      address: 'https://www.latimes.com/environment',
      base: '',
  },
  {
      name: 'smh',
      address: 'https://www.smh.com.au/environment/climate-change',
      base: 'https://www.smh.com.au',
  },
  {
      name: 'un',
      address: 'https://www.un.org/climatechange',
      base: '',
  },
  {
      name: 'bbc',
      address: 'https://www.bbc.co.uk/news/science_and_environment',
      base: 'https://www.bbc.co.uk',
  },
  {
      name: 'es',
      address: 'https://www.standard.co.uk/topic/climate-change',
      base: 'https://www.standard.co.uk'
  },
  {
      name: 'sun',
      address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
      base: ''
  },
  {
      name: 'dm',
      address: 'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
      base: ''
  },
  {
      name: 'nyp',
      address: 'https://nypost.com/tag/climate-change/',
      base: ''
  }
]
const articles = [];
const scrapeArticles = (newsPaper, climateArticles) => {
  axios.get(newsPaper.address).then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    $('a:contains("climate")',html).each(function() {
      const title = $(this).text();
      const url = $(this).attr("href");
      climateArticles.push({ title, url: newsPaper.base+url, newspaper: newsPaper.name });
    })
  })
  .catch(err => console.log(err));
}

newsPapers.forEach(newsPaper => {
  scrapeArticles(newsPaper, articles);
})

app.get("/", (req, res) => {
  res.json("Welcome to my climate change API.");
})

app.get("/news", (req, res) => {
  res.status(200).json(articles);
})

app.get("/news/:newspaperId", async (req, res) => {
  const newspaperId = req.params.newspaperId;
  const newspaper = newsPapers.filter(newspaper => newspaper.name === newspaperId)[0];
  const specificArticles = [];
  if(newspaper === undefined){
    return res.status(404).json({ message : "news paper not found"})
  }
  console.log("invalid");
  axios.get(newspaper.address).then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    $('a:contains("climate")',html).each(function() {
      const title = $(this).text();
      const url = $(this).attr("href");
      specificArticles.push({ title, url: newspaper.base+url, newspaper: newspaper.name });
    })
    res.status(200).json(specificArticles);
  })
  .catch(err => console.log(err))
})

app.listen(PORT, () => {
  console.log("Server running on port: ", PORT);
})
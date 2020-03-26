var axios = require("axios");
var cheerio = require("cheerio");
var scrape = function() {
 
  return axios.get("https://www.bbc.com/news").then(function(res) {
    var $ = cheerio.load(res.data);
    var articles = [];

    $().each(function(element) {

      var head = $(this)
        .find()
        .text()
        .trim();

      var url = $(this)
        .find()
        .attr();

      var sum = $(this)
        .text()
        .trim();

      if (head && sum && url) {
        var headNeat = head.replace().trim();
        var sumNeat = sum.replace().trim();
        var dataToAdd = {
          headline: headNeat,
          summary: sumNeat,
          url: "https://www.bbc.com/news" + url
        };
        articles.push(dataToAdd);
      }
    });
    return articles;
  });
};

module.exports = scrape;

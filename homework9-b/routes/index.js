const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");
const googleTrends = require('google-trends-api');

const G_key = "23cf02b2-6f03-4cfe-b6d7-949c4b4c3dcd";

// TODO picture

function guardian_home(req, res){
    fetch('https://content.guardianapis.com/search?order-by=newest&show-fields=thumbnail&api-key='+G_key)
        .then(response => response.json())
        .then(function(response) {
            // console.log(response.response.results);
            response = response.response;
            let filtered = Array();
            for (let i = 0; i < response.results.length; ++i) {
                // console.log(response.results[i]);
                try {
                    let one_result = {};
                    one_result["title"] = response.results[i].webTitle;
                    try {
                        one_result["image"] = response.results[i].fields.thumbnail;
                    } catch (e) {
                        one_result["image"] = 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png'
                    }
                    one_result["date"] = response.results[i].webPublicationDate;
                    // one_result["description"] = response.results[i].blocks.body[0].bodyTextSummary;
                    one_result["sectionId"] = response.results[i].sectionName;
                    one_result["id"] = response.results[i].id;
                    one_result["url"] = response.results[i].webUrl;
                    filtered.push(one_result);
                } catch (e) {
                    console.log(e)
                }
            }
            res.json(filtered);
            // res.end( JSON.stringify( response ) )
        })
}

function guardian_section(req, res){
  const section = req.query.section;
  // console.log(section);
  fetch('https://content.guardianapis.com/'+section+'?api-key='+G_key+'&show-blocks=all')
      .then(response => response.json())
      .then(function(response) {
          // console.log(response.response.results);
          response = response.response;
          let filtered = Array();
          let image_len;
          for (let i = 0; i < response.results.length; ++i) {
              try {
                  // console.log(i);
                  // console.log(response.results[i]);
                  let one_result = {};
                  one_result["title"] = response.results[i].webTitle;
                  // console.log(response.results[i].blocks.main.elements[0].assets);
                  // console.log(response.results[i].blocks.main.elements[0].assets[-1]);
                  try {
                      image_len = response.results[i].blocks.main.elements[0].assets.length;
                  } catch (e) {
                      image_len = 0
                  }
                  if (image_len === 0) {
                      one_result["image"] = 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png'
                  } else {
                      one_result["image"] = response.results[i].blocks.main.elements[0].assets[image_len - 1].file;
                  }
                  one_result["date"] = response.results[i].webPublicationDate;
                  // one_result["description"] = response.results[i].blocks.body[0].bodyTextSummary;
                  one_result["sectionId"] = response.results[i].sectionName;
                  one_result["id"] = response.results[i].id;
                  one_result["url"] = response.results[i].webUrl;
                  filtered.push(one_result);
              } catch (e) {
                console.log(e)
              }
          }
          res.json(filtered);
          // res.end( JSON.stringify( response ) )
      })
}

function guardian_search(req, res){
    const q = req.query.q;
    // console.log(section);
    fetch('https://content.guardianapis.com/search?q='+q+'&api-key='+G_key+'&show-blocks=all')
        .then(response => response.json())
        .then(function(response) {
            // console.log(response.response.results);
            response = response.response;
            let filtered = Array();
            let image_len;
            for (let i = 0; i < response.results.length; ++i) {
                // console.log(response.results[i]);
                try {
                    let one_result = {};
                    one_result["title"] = response.results[i].webTitle;
                    // console.log(response.results[i].blocks.main.elements[0].assets);
                    // console.log(response.results[i].blocks.main.elements[0].assets[-1]);
                    try {
                        image_len = response.results[i].blocks.main.elements[0].assets.length;
                    } catch (e) {
                        image_len = 0;
                    }

                    if (image_len === 0) {
                        one_result["image"] = 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png'
                    } else {
                        one_result["image"] = response.results[i].blocks.main.elements[0].assets[image_len - 1].file;
                    }
                    one_result["date"] = response.results[i].webPublicationDate;
                    // one_result["description"] = response.results[i].blocks.body[0].bodyTextSummary;
                    one_result["sectionId"] = response.results[i].sectionId;
                    one_result["id"] = response.results[i].id;
                    one_result["url"] = response.results[i].webUrl;
                    filtered.push(one_result);
                } catch (e) {

                }
            }
            res.json(filtered);
            // res.end( JSON.stringify( response ) )
        })
}

function guardian_detail(req, res){
    const id = req.query.id;
    // console.log(section);
    fetch('https://content.guardianapis.com/'+id+'?&api-key='+G_key+'&show-blocks=all')
        .then(response => response.json())
        .then(function(response) {
            // console.log(response.response.results);
            const content = response.response.content;
            let image_len;
            let result = {};
            // console.log(content.blocks.body);
            try {
                result["title"] = content.webTitle;
                // console.log(response.results[i].blocks.main.elements[0].assets);
                // console.log(response.results[i].blocks.main.elements[0].assets[-1]);
                try {
                    image_len = content.blocks.main.elements[0].assets.length;
                } catch (e) {
                    image_len = 0;
                }

                if (image_len === 0) {
                    result["image"] = 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png'
                } else {
                    result["image"] = content.blocks.main.elements[0].assets[image_len - 1].file;
                }
                result["date"] = content.webPublicationDate;
                result["description"] = content.blocks.body[0].bodyHtml;
                for (let i=1; i<content.blocks.body.length; ++i){
                    result["description"] += content.blocks.body[i].bodyHtml;
                }
                result["sectionId"] = content.sectionId;
                result["id"] = content.id;
                result["url"] = content.webUrl;
            } catch (e) {
                console.log(e);
            }

            res.json(result);
            // res.end( JSON.stringify( response ) )
        })
}

function get_trend(req, res){
    let q = req.query.q;
    if (typeof(q) === "undefined"){
        q = "Coronavirus";
    }
    optionsObject = {"keyword":q, "startTime": new Date(2019,6,1)};

    // console.log(section);
    googleTrends.interestOverTime(optionsObject)
        .then(function(response) {
            // console.log(response.response.results);
            response = JSON.parse(response).default.timelineData;

            // console.log(typeof(response));
            let result = [];
            for (let i=0; i<response.length; ++i){
                result.push(response[i].value[0]);
            }
            // console.log('These proxied results are incredible', response);

            res.json(result);
            // res.end( JSON.stringify( response ) )
        })
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/h', function(req, res, next) {
    guardian_home(req, res);
});

router.get('/s', function(req, res, next) {
    guardian_section(req, res);
});

router.get('/gs', function(req, res, next) {
    guardian_search(req, res);
});


router.get('/gd', function(req, res, next) {
    guardian_detail(req, res);
});

router.get('/trend', function(req, res, next) {
    get_trend(req, res);
});

module.exports = router;

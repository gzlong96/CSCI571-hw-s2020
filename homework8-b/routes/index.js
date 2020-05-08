const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");

const G_key = "23cf02b2-6f03-4cfe-b6d7-949c4b4c3dcd";
const N_key = "Zf7V2K8yr8lHKDF6d3gGBkVGt1xC4pJ5";

// TODO picture
function get_guardian(req, res){
  const section = req.query.section;
  // console.log(section);
  if (typeof(section) == "undefined" || section === "" || section === "home"){
    fetch('https://content.guardianapis.com/search?api-key='+G_key+'&section=(sport|business|technology|politics)&show-blocks=all')
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
                        image_len = 0
                    }
                    if (image_len === 0) {
                        one_result["image"] = 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png'
                    } else {
                        one_result["image"] = response.results[i].blocks.main.elements[0].assets[image_len - 1].file;
                    }
                    one_result["date"] = response.results[i].webPublicationDate.substring(0, 10);
                    one_result["description"] = response.results[i].blocks.body[0].bodyTextSummary;
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
  else{
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
                      one_result["date"] = response.results[i].webPublicationDate.substring(0, 10);
                      one_result["description"] = response.results[i].blocks.body[0].bodyTextSummary;
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
}

function get_nytimes(req, res){
    let section = req.query.section;
    if (section === 'sport'){
        section = 'sports';
    }
    // console.log(section);
    if (typeof(section) == "undefined" || section === "" || section === "home"){
        fetch('https://api.nytimes.com/svc/topstories/v2/home.json?api-key='+N_key)
            .then(response => response.json())
            .then(function(response) {
                // console.log(response.response.results);
                // response = response.response;
                let filtered = Array();
                for (let i=0; i<response.results.length; ++i){
                    // console.log(response.results[i]);
                    try{
                        let one_result = {};
                        one_result["title"] = response.results[i].title;
                        // console.log(response.results[i].blocks.main.elements[0].assets);
                        // console.log(response.results[i].blocks.main.elements[0].assets[-1]);
                        image_len = response.results[i].multimedia.length;
                        for (let j=0; j<image_len; ++j){
                            if (response.results[i].multimedia[j].width > 2000){
                                one_result["image"] = response.results[i].multimedia[j].url;
                            }
                        }
                        if (typeof(one_result["image"])=="undefined"){
                            one_result["image"] = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg'
                        }
                        if (one_result["image"].substring(0,4) !== 'http'){
                            one_result["image"] = 'https://nyt.com/' + one_result["image"]
                        }

                        one_result["date"] = response.results[i].published_date.substring(0, 10);
                        one_result["description"] = response.results[i].abstract;
                        one_result["sectionId"] = response.results[i].section;
                        one_result["id"] = response.results[i].url;
                        one_result["url"] = response.results[i].url;
                        filtered.push(one_result);
                    }
                    catch (e) {

                    }
                }
                res.json(filtered);
                // res.end( JSON.stringify( response ) )
            })
    }
    else{
        fetch('https://api.nytimes.com/svc/topstories/v2/'+section+'.json?api-key='+N_key)
            .then(response => response.json())
            .then(function(response) {
                // console.log(response.response.results);
                // response = response.response;
                let filtered = Array();
                for (let i=0; i<response.results.length; ++i){
                    // console.log(response.results[i]);
                    try{
                        let one_result = {};
                        one_result["title"] = response.results[i].title;
                        // console.log(response.results[i].blocks.main.elements[0].assets);
                        // console.log(response.results[i].blocks.main.elements[0].assets[-1]);
                        image_len = response.results[i].multimedia.length;
                        for (let j=0; j<image_len; ++j){
                            if (response.results[i].multimedia[j].width > 2000){
                                one_result["image"] = response.results[i].multimedia[j].url;
                            }
                        }
                        if (typeof(one_result["image"])=="undefined"){
                            one_result["image"] = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg'
                        }
                        if (one_result["image"].substring(0,4) !== 'http'){
                            one_result["image"] = 'https://nyt.com/' + one_result["image"]
                        }

                        one_result["date"] = response.results[i].published_date.substring(0, 10);
                        one_result["description"] = response.results[i].abstract;
                        one_result["sectionId"] = response.results[i].section;
                        one_result["id"] = response.results[i].url;
                        one_result["url"] = response.results[i].url;
                        filtered.push(one_result);
                    }
                    catch (e) {

                    }
                }
                res.json(filtered);
                // res.end( JSON.stringify( response ) )
            })
    }
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
                    one_result["date"] = response.results[i].webPublicationDate.substring(0, 10);
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

function nytimes_search(req, res){
    let q = req.query.q;
    // console.log(section);
    fetch('https://api.nytimes.com/svc/search/v2/articlesearch.json?q='+q+'&api-key='+N_key)
        .then(response => response.json())
        .then(function(response) {
            // console.log(response.response);
            // response = response.response;
            let filtered = Array();
            let docs = response.response.docs;
            let image_len;
            for (let i = 0; i < docs.length; ++i) {
                // console.log(response.results[i]);
                try {
                    let one_result = {};
                    one_result["title"] = docs[i].headline.main;
                    // console.log(response.results[i].blocks.main.elements[0].assets);
                    // console.log(response.results[i].blocks.main.elements[0].assets[-1]);
                    image_len = docs[i].multimedia.length;
                    for (let j = 0; j < image_len; ++j) {
                        if (docs[i].multimedia[j].width > 2000) {
                            one_result["image"] = docs[i].multimedia[j].url;
                        }
                    }
                    if (typeof (one_result["image"]) == "undefined") {
                        one_result["image"] = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg'
                    }
                    if (one_result["image"].substring(0,4) !== 'http'){
                        // console.log(one_result["image"]);
                        one_result["image"] = 'https://nyt.com/' + one_result["image"]
                    }

                    one_result["date"] = docs[i].pub_date.substring(0, 10);
                    // one_result["description"] = response.results[i].abstract;
                    one_result["sectionId"] = docs[i].news_desk;
                    one_result["id"] = docs[i].web_url;
                    one_result["url"] = docs[i].web_url;
                    filtered.push(one_result);
                } catch (e) {
                    console.log(e)
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
                result["date"] = content.webPublicationDate.substring(0, 10);
                result["description"] = content.blocks.body[0].bodyTextSummary;
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

function nytimes_detail(req, res){
    let id = req.query.id;
    // console.log(section);
    fetch('https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:(\"'+id+'\") &api-key='+N_key)
        .then(response => response.json())
        .then(function(response) {
            // console.log(response.response);
            // response = response.response;
            let doc = response.response.docs[0];
            let image_len;
            let one_result = {};
                // console.log(response.results[i]);
            try {
                one_result["title"] = doc.headline.main;
                // console.log(response.results[i].blocks.main.elements[0].assets);
                // console.log(response.results[i].blocks.main.elements[0].assets[-1]);
                image_len = doc.multimedia.length;
                for (let j = 0; j < image_len; ++j) {
                    if (doc.multimedia[j].width > 2000) {
                        one_result["image"] = doc.multimedia[j].url;
                    }
                }
                if (typeof (one_result["image"]) == "undefined") {
                    one_result["image"] = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg'
                }
                if (one_result["image"].substring(0,4) !== 'http'){
                    // console.log(one_result["image"]);
                    one_result["image"] = 'https://nyt.com/' + one_result["image"]
                }

                one_result["date"] = doc.pub_date.substring(0, 10);
                one_result["description"] = doc.abstract;
                one_result["sectionId"] = doc.news_desk;
                one_result["id"] = doc.web_url;
                one_result["url"] = doc.web_url;
            } catch (e) {
                console.log(e)
            }
            res.json(one_result);
            // res.end( JSON.stringify( response ) )
        })
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/g', function(req, res, next) {
  get_guardian(req, res);
});

router.get('/n', function(req, res, next) {
    get_nytimes(req, res);
});

router.get('/gs', function(req, res, next) {
    guardian_search(req, res);
});

router.get('/ns', function(req, res, next) {
    nytimes_search(req, res);
});

router.get('/gd', function(req, res, next) {
    guardian_detail(req, res);
});

router.get('/nd', function(req, res, next) {
    nytimes_detail(req, res);
});

module.exports = router;

from flask import Flask, jsonify, request
from newsapi import NewsApiClient
from newsapi.newsapi_exception import NewsAPIException
from collections import defaultdict


API_KEY = '894d67839ac24862868fdf312c1d7b01'

app = Flask(__name__)

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 60 

myNewsapi = NewsApiClient(api_key=API_KEY)

def load_stopwords():
    stopwords_set = set()
    with open('stopwords_en.txt') as f:
        for line in f.readlines():
            stopwords_set.add(line.strip())
    return stopwords_set

stopwords_set = load_stopwords()


@app.route('/')
def homepage():
    return app.send_static_file("index.html")


@app.route('/static/index.js')
def homepage_js():
    return app.send_static_file("index.js")


@app.route('/static/index.css')
def homepage_css():
    return app.send_static_file("index.css")


@app.route('/headlines', methods=['GET'])
def headlines():
    headline_list = []
    entries = ['author', 'description', 'title', 'url', 'urlToImage', 'publishedAt', 'source']
    top_headlines = myNewsapi.get_top_headlines(language='en', page=1, page_size=20)
    for article in top_headlines['articles']:
        if len(headline_list) == 5:
            break
        flag = True
        for entry in entries:
            if entry not in article or article[entry] is None or len(article[entry])==0:
                flag = False
                break
        if flag and ('name' not in article['source'] or len(article['source']['name'])==0):
            flag = False
        if flag:
            headline_list.append(article)
    # print(jsonify({'articles': headline_list}))
    return jsonify({'articles': headline_list})

cloud_word_size = [30, 26, 24, 20, 19, 18, 16, 15, 15, 14, 13, 13, 12, 12, 11] + [10] * 15

@app.route('/wordcloud', methods=['GET'])
def wordcloud():
    top_headlines = myNewsapi.get_top_headlines(language='en', page=1, page_size=100)
    word_count = defaultdict(int)
    for headline in top_headlines['articles']:
        for word in headline['title'].lower().split():
            if word not in stopwords_set:
                word_count[word] += 1
    
    top_words = sorted(word_count.items(), key=lambda x: -x[1])[:30]
    myWords = []
    for i in range(len(top_words)):
        myWords.append({'word':top_words[i][0], 'size':cloud_word_size[i]})

    # for word in top_words:
        # myWords.append({'word':word[0], 'size':word[1]})
    
    return jsonify({'words':myWords})


@app.route('/cnn', methods=['GET'])
def cnn():
    headline_list = []
    entries = ['author', 'description', 'title', 'url', 'urlToImage', 'publishedAt', 'source']
    top_headlines = myNewsapi.get_top_headlines(sources='cnn', language='en', page=1, page_size=30)
    for article in top_headlines['articles']:
        if len(headline_list) == 4:
            break
        flag = True
        for entry in entries:
            if entry not in article or article[entry] is None or len(article[entry])==0:
                flag = False
                break
        if flag and ('name' not in article['source'] or len(article['source']['name'])==0):
            flag = False
        if flag:
            headline_list.append(article)
    # print(jsonify({'articles': headline_list}))
    return jsonify({'articles': headline_list})


@app.route('/fox', methods=['GET'])
def fox():
    headline_list = []
    entries = ['author', 'description', 'title', 'url', 'urlToImage', 'publishedAt', 'source']
    top_headlines = myNewsapi.get_top_headlines(sources='fox-news', language='en', page=1, page_size=20)
    for article in top_headlines['articles']:
        if len(headline_list) == 4:
            break
        flag = True
        for entry in entries:
            if entry not in article or article[entry] is None or len(article[entry])==0:
                flag = False
                break
        if flag and ('name' not in article['source'] or len(article['source']['name'])==0):
            flag = False
        if flag:
            headline_list.append(article)
    # print(jsonify({'articles': headline_list}))
    return jsonify({'articles': headline_list})


@app.route('/news_card', methods=['GET'])
def get_card():
    _keyword = request.args.get("keyword")
    _from = request.args.get("from")
    _to = request.args.get("to")
    _category = request.args.get("category")
    _source = request.args.get("source")
    headline_list = []
    entries = ['author', 'description', 'title', 'url', 'urlToImage', 'publishedAt', 'source']
    try:
        if _source == 'all':
            top_headlines = myNewsapi.get_everything(q=_keyword, from_param=_from, to=_to, language='en', page=1, page_size=30)
        else:
            top_headlines = myNewsapi.get_everything(q=_keyword, from_param=_from, to=_to, sources=_source,  language='en', page=1, page_size=30)

        for article in top_headlines['articles']:
            if len(headline_list) == 15:
                break
            flag = True
            for entry in entries:
                if entry not in article or article[entry] is None or len(article[entry])==0:
                    flag = False
                    break
            if flag and ('name' not in article['source'] or len(article['source']['name'])==0):
                flag = False
            if flag:
                headline_list.append(article)

        print(jsonify({'articles': headline_list}))
        return jsonify({'articles': headline_list})
    except NewsAPIException as e_msg:
        return jsonify({'message':e_msg.get_message()})


@app.route('/get_source', methods=['GET'])
def get_source():
    _category = request.args.get("category")
    if _category=='all':
        sources = myNewsapi.get_sources(language='en', country='us')
    else:
        sources = myNewsapi.get_sources(category=_category, language='en', country='us')
    source_list = []
    for source in sources['sources']:
        source_list.append({'id':source['id'], 'name':source['name']})
        if len(source_list)==9:
            break
    # print(source_list)
    return jsonify({'articles': source_list})


if __name__ == "__main__":
    # Init

    # /v2/top-headlines
    app.run(debug=True)

from flask import Flask, render_template, request, jsonify
from movie_recommender import MovieRecommender

app = Flask(__name__)
recommender = MovieRecommender()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    movie_name = request.json['movie_name']
    results = recommender.search(movie_name)
    return jsonify(results.to_dict('records'))

@app.route('/recommend', methods=['POST'])
def recommend():
    movie_id = request.json['movie_id']
    recommendations = recommender.find_similar_movies(movie_id)
    return jsonify(recommendations.to_dict('records'))

if __name__ == '__main__':
    app.run(debug=True)

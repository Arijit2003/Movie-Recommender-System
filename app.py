from flask import Flask,request, render_template, jsonify
import requests 
import pandas as pd
import pickle

movies_dict=pickle.load(open("./movies_dict.pkl","rb"))
similarity=pickle.load(open("./similarity.pkl","rb"))
movies_df=pd.DataFrame(movies_dict)

def recommend(movie):
    LI=[]
    movie_index=movies_df[movies_df["title"]==movie].index[0]
    distances=similarity[movie_index]
    movies_list=sorted(list(enumerate(distances)),reverse=True,key=lambda x:x[1])[1:6]
    for i in movies_list:
        LI.append(fetchPosters(movies_df.iloc[i[0]].movie_id))
    return LI


def fetchPosters(movie_id):
    url = "https://api.themoviedb.org/3/movie/{}?language=en-US".format(movie_id)
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NzAxNTE1MjZmOTc1MzM0NjRkM2I5NTRmOGZmYTM1MSIsIm5iZiI6MTcyNTQzMjIxMy4zNjM5MzgsInN1YiI6IjY2ZDdmYjBmM2U3ZTI4MTRmMDhmMDAxZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nNrbRn5obHc7X1HU9O-CYGo-R3mVPdcYesanEXKs7tU"
    }
    response = requests.get(url, headers=headers)
    data=response.json()
    return {data["original_title"]:"https://image.tmdb.org/t/p/w200"+data["poster_path"]}



app=Flask(__name__)



@app.route("/")
def index():
    list=movies_df.apply(lambda row: {row['movie_id']: row['title']}, axis=1).tolist()
    return render_template("index.html",movies=list)


@app.route("/predict",methods=['POST'])
def predict():
    txt=request.get_data().decode('utf-8')
    Li=recommend(txt)
    return jsonify(Li)


if __name__=="__main__":
    app.run(debug=True)



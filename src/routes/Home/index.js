import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import Parse from 'parse';
import './Home.css'
import { useParseQuery } from '@parse/react';


export default function Home() {
  const [postText, setPostText] = useState('');
  const history = useHistory();

  const Character = Parse.Object.extend('Game');
  const characterQuery = new Parse.Query(Character);

  useEffect(() => {
    async function checkUser() {
      const currentUser = await Parse.User.currentAsync();
      if (!currentUser) {
        alert('You need to be logged in to access this page');
        history.push("/auth");
      }
    }
    checkUser();
  }, []);

  const {
    isLive, // Indicates that Parse Live Query is connected
    isLoading, // Indicates that the initial load is being processed
    isSyncing, // Indicates that the library is getting the latest data from Parse Server
    results, // Stores the current results in an array of Parse Objects
    count, // Stores the current results count
    error, // Stores any error
    reload // Function that can be used to reload the data
  } = useParseQuery(
    characterQuery, // The Parse Query to be used
    {
      enableLocalDatastore: true, // Enables cache in local datastore (default: true)
      //cancel web socket conection
      enableLiveQuery: false // Enables live query for real-time update (default: true)
    }
  );

  const handleSubmitPost = (e) => {
    e.preventDefault();
    const Post = Parse.Object.extend("Game");
    const newPost = new Post();
    newPost.save({
      name: postText,
      authorName: Parse.User.current().get('username'),
    });
    //get data once after post
    reload()
    setPostText(" ");
  };

  return (
    <div className="App">
      <header className="app-header">
        <img className="logo" alt="back4app's logo" src={'https://blog.back4app.com/wp-content/uploads/2019/05/back4app-white-logo-500px.png'} />
        <h2 className="spacing">parse hooks</h2>
        <span>social network</span>
      </header>

      <div className="posts-container">
        <form onSubmit={handleSubmitPost} className="actions">
          <textarea  value={postText} onChange={event => setPostText(event.currentTarget.value)} />
          <button type="submit" onKeyPress={handleSubmitPost}>post</button>
        </form>


        <div className="post-list">
          {results && results.map((user, index) => (
            <div className="post" key={index}>
              <span>{user.get('authorName')}</span>
              <p>{user.get('name')}</p>
            </div>))}
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import Parse from 'parse';
import './Home.css'
import { useParseQuery } from '@parse/react';


export default function Home() {
  const [checkbox, setCheckbox] = useState(false);
  const [title, setTitle] = useState('');
  const [overwolfId, setOverwolfId] = useState('');
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
      enableLocalDatastore: false, // Enables cache in local datastore (default: true)
      //cancel web socket conection
      enableLiveQuery: false // Enables live query for real-time update (default: true)
    }
  );

  const handleSubmitPost = (e) => {
    e.preventDefault();
    const Post = Parse.Object.extend("Game");
    const newPost = new Post();
    newPost.save({
      Title: title,
      overwolfId: overwolfId,
    });
    //get data once after post
    reload()
    setTitle()
    setOverwolfId()
  };

  return (
    <div className="App">
      <header className="app-header">
        <img className="logo" alt="back4app's logo" src={'https://blog.back4app.com/wp-content/uploads/2019/05/back4app-white-logo-500px.png'} />
        <h2 className="spacing">parse hooks</h2>
        <span>social network</span>
      </header>

      <div className="posts-container">
        {/* <form  className="actions"> */}
          title :<input value={title} onChange={event => setTitle(event.currentTarget.value)} />
          overwolfId :<input value={overwolfId} onChange={event => setOverwolfId(event.currentTarget.value)} />
          {/* active <input value={active} onChange={event => setOverwolfId(event.currentTarget.value)} /> */}
          active :<input type="checkbox" defaultChecked={checkbox} onChange={()=>{
            setCheckbox(!checkbox)
            console.log(checkbox)
          }} />
          <button type="button" className='submitButton' onClick={handleSubmitPost}  onKeyPress={handleSubmitPost}>post</button>
        {/* </form> */}


        <div className="post-list">
          {results && results.map((user, index) => (
            <div className="post" key={index}>
              <span>{user.get('Title')}</span>
              <p>overwolf ID : {user.get('overwolfId')} &emsp;&emsp; &emsp; activate : {user.get('active').toString()}</p>
            </div>))}
        </div>
      </div>
    </div>
  );
}
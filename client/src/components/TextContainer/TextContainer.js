import React,{ useState} from 'react';

import onlineIcon from '../../icons/onlineIcon.png';
import Search from '../Search/Search';
import './TextContainer.css';

const TextContainer = ({ users, socket, name}) => {

  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState([])
  const [visibility,setVisibility] = useState(false)
  
  // Search button handler
  const searchChat =  (event) => {
    event.preventDefault();

    //emitting the searchchat event for search function
      if(searchText){
        socket.emit('searchChat', searchText, name, () => setSearchText(''));
    } 
    
    //setting the results fetched from server
      socket.on('searchResult', ({result}) => {
      setSearchResult(result);
    });  
 
}

return(
  <div>
    <div className='textContainer'>
     { (searchResult) ? <Search searchResult={searchResult} visible={visibility}/>  : null
      }
    <div>
      <h2>Chat Application <span role="img" aria-label="emoji">💬</span></h2>
      
    </div>
    {
      users
        ? (
          <div>
            <h3>People currently chatting:</h3>
            <div className='activeContainer'>
              <h2>
                {users.map(({name}) => (
                  <div key={name} className="activeItem">
                    {name}
                    <img alt="Online Icon" src={onlineIcon}/>
                  </div>
                ))}
              </h2>
            </div>
          </div>
        )
        : null
    }
    
    { /* Search box and find button  */}

      {/* <form className='form'>
      <input type='text'
        className='input'
        placeholder='Search...'
        value={searchText}
        onChange={({target: { value }}) => setSearchText(value)}
      />
      
      <button className='sendButton'
      onClick={event => searchChat(event)}>
      Find
      </button>
      </form> */}
    </div>
    </div>

);
  }

export default TextContainer;
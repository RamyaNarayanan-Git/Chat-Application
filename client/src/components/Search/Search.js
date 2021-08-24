import React,{ useState} from 'react';
import closeIcon from '../../icons/closeIcon.png';
import './Search.css';

const Search = ({searchResult, visible}) => {
    const [visibility,setVisibility] = useState(visible)

    return(
        <div
      className={`${
        visibility ? 'modal-overlay shSow-modal' : 'modal-overlay'
      }`}
    >
      <div className='modal-container'>
        <h3>modal content</h3>
        {searchResult}
        <div className='righttInnerContainer'>
            <button onClick={()=>setVisibility(false)}><img src={closeIcon} alt='close icon'/></button>
         </div>

      </div>
    </div>
  );

}
export default Search;

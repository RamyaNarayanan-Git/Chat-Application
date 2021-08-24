import React from 'react';

import './Message.css';

const Message = ({ message:{text,user}, name }) => {
    let isSentByCurrUSer = false;
    const trimName = name.trim().toLowerCase();
    if (user === trimName) {
        isSentByCurrUSer = true;
    }

    return (
        isSentByCurrUSer
            ? (
                <div className='messageContainer justifyEnd'>
                    <p className='sentText pr-10'>{trimName}</p>
                    <div className='messageBox backgroundBlue'>
                        <p className='messagetext colorWhite'>{text}</p>
                    </div>
                </div>
            )
            : (
                <div className='messageContainer justifyStart'>
                    
                    <div className='messageBox backgroundLight'>
                        <p className='messagetext colorDark'>{text}</p>
                    </div>
                    <p className='sentText pl-10'>{user}</p>
                </div>
            )
    );
}

export default Message
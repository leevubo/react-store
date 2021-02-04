import React from 'react';
import './index.css';

const Marker = (props: any) => {
    const { name, id, type, showDealer,  showSpringFree} = props;
    return (
      <div 
        id={id}
        className="marker"
        style={{ cursor: 'pointer'}, showSpringFree && type === 'springfree' || showDealer && type !== 'springfree' ? {display:'block'} : {display:'none'}}
        title={name}
      >
        {
          type === 'springfree' ?
          <img src="./image/b1.png"  alt=""/> :
          <img src="./image/p1.png"  alt=""/>
        }
      </div>
    );
  };

  export default Marker;
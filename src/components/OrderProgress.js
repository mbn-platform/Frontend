import React from 'react';
export const OrderProgress = ({progress}) => (
  <div style={{height: '5px', width: '20px', border: '1px solid gray'}}>
    <div style={{height: '100%', width: `${Math.floor(progress * 100)}%`, backgroundColor: 'red'}}/>
  </div>
);


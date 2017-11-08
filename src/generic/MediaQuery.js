import MediaQuery from 'react-responsive';
import React from 'react';

export const Desktop = (props) => (<MediaQuery {...props} minWidth={1028} />);
export const Mobile = (props) => (<MediaQuery {...props} maxWidth={1027} />);

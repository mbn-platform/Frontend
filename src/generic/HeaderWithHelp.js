import React from 'react';
import './HeaderWithHelp.css';

const HeaderWithHelp = (header) => {
  return () => (
    <div className="header_with_help">{header}
      <div className="header_with_help_icon">
      </div>
    </div>
  );
}

export default HeaderWithHelp;

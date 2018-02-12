import React from 'react';

const DemoButton = () => (
  <div className="demo_button_wr">
    <button
      onClick={() => window.location = 'https://demo.membrana.io'}
      className="login_step_login_submit">
      DEMO
    </button>
  </div>
);

export default DemoButton;

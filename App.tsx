import React from 'react';
import Styles from './App.module.scss';


import { Auth } from './containers';

function App() {
  return (
    <div className={Styles.app}>
      <Auth />
    </div>
  );
}

export default App;

import React from 'react';
import {
  BrowserRouter,
} from "react-router-dom";
import './App.css';
import { Provider } from 'mobx-react';
import Index from './page/index'
import {commonStore, homeStore} from "./store/init";

const stores = {
  commonStore,
  homeStore,
};

const App: React.FC = () => {
  return (
    <Provider {...stores}>
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    </Provider>
  );
}

export default App;

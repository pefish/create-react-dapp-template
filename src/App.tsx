import React from 'react';
import {
  BrowserRouter,
} from "react-router-dom";
import './App.css';
import { Provider } from 'mobx-react';
import CommonStore from './store/common_store';
import HomeStore from './store/home_store';
import Index from './page/index'


const commonStore = new CommonStore()
const homeStore = new HomeStore(commonStore)
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

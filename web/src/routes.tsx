import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import PageHome from './pages/Home';
import PageCreatePoint from './pages/CreatePoint';
import PageConfirmation from './pages/Confirmation';

const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={PageHome} path="/" exact />
      <Route component={PageCreatePoint} path="/create-point" />
      <Route component={PageConfirmation} path="/confirmation" />
    </BrowserRouter>
  )
}

export default Routes;
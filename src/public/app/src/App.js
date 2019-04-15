import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Line, Pie } from 'react-chartjs-2';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import SnapshotPage from './containers/snapshotsPage/snapshotsPage';
import ViewSnapshotPage from './containers/viewSnapshotPage/viewSnapshotPage';
import ViewFile from './containers/viewFile/viewFile';

class App extends Component {

  render() {
    return (
      <BrowserRouter basename="/">
          <Switch>
             <Route path="/snapshots/:id/file/:path" component={ViewFile}/>
             <Route path="/snapshots/:id" component={ViewSnapshotPage}/>
             <Route path="/snapshots" component={SnapshotPage}/>
          </Switch>
      </BrowserRouter>
    );
  }
}

export default App;

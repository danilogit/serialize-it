import React, { Component } from 'react';
import axios from 'axios';
import { Line, Pie } from 'react-chartjs-2';
import {Link} from 'react-router-dom';

const dataPie = {
  labels: [
    'Serialized',
    'Not Serialized',
  ],
  datasets: [{
    data: [300, 50],
    backgroundColor: [
    '#FF6384',
    '#36A2EB',
    ],
    hoverBackgroundColor: [
    '#FF6384',
    '#36A2EB',
    ]
  }]
};

const data = {
  labels: ['18 nov', '17nov', '16nov', '15nov', '14nov', '13nov', '12nov'],
  datasets: [
    {
      label: 'serialized',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40],

    },
    {
      label: 'not serialized',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'red',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'red',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [34, 22, 10, 12, 56, 55, 60],

    }
  ]
};

class SnapshotsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      path: "/placeholder",
      snapshots: [],
      isLoading: false
    }
  }

  onPathChange = (ev) => {
    this.setState({ path: ev.target.value });
  }


  onClickSearch = () => {
    this.search();
  }

  fetchSnapshots = () => {
    axios.get('http://localhost:4488/api/v1/snapshots')
      .then(response => {
        console.log(response);
        if (response.data != null) {
          this.setState({ snapshots: response.data })
        }
      })
  }

  search = () => {
    this.setState({ isLoading: true })
    axios.get('http://localhost:4488/api/v1/parse?path=' + this.state.path)
      .then(response => {
        console.log(response);
        if (response.data != null) {
          this.setState({ files: response.data })
        }

      })
      .finally(() => {
        this.setState({ isLoading: false })
      })
  }

  componentDidMount = () => {
    this.fetchSnapshots();
  }


  render() {
    return (
      <div className="container mt-5">
        <div className="card">
          <div className="card-body p-5">
            <h4>Root folder: {this.state.path}</h4>
            <button onClick={this.onClickSearch} className="btn btn-primary">Create Snapshot</button>
          </div>

        </div>

        <div className="row">
          <div className="col-md-12">
            <Line data={data} height={100}></Line>
          </div>
        </div>

        <h3 className="mt-5"> Snapshots</h3>
        <table className="table mb-5">
          <tbody>
            <tr>
              <th>Date</th>
              <th>Total Files</th>
              <th>Total Classes</th>
              <th>Serialized Classes</th>
              <th>Not Serialized Classes</th>
              <th>Auto Serialized</th>
              <th></th>
            </tr>
            {this.state.snapshots.map((snapshot, i) => {
              return <tr key={i}>
                <td>{snapshot.date}</td>
                <td>{snapshot.statistics['countFiles']}</td>
                <td>{snapshot.statistics['countClasses']}</td>
                <td>{snapshot.statistics['countClassesSerialized']}</td>
                <td>{snapshot.statistics['countClassesNotSerialized']}</td>
                <td>{snapshot.statistics['countReplacements']}</td>
                <td><Link to={"/snapshots/" + snapshot._id} className="btn btn-primary">View</Link></td>
              </tr>
            })}
          </tbody>

        </table>

      </div>
    );
  }
}

export default SnapshotsPage;

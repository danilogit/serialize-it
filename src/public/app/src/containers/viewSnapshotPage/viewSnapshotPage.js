import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Line, Pie } from 'react-chartjs-2';
import queryString from 'query-string';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';


class ViewSnapshotPage extends Component {
    state = {
        snapshot: {
            files: [],
            statistics: {}
        },
        queries: {
            withClasses: true,
            withoutClasses: true,
            onlySerialized: false
        }
    }

    getPieData = () => {
        const serializedPercentage = Math.floor((this.state.snapshot['statistics'].countClassesSerialized / this.state.snapshot['statistics'].countClasses) * 100);
        const notSerializedPercentage = Math.floor(100 - serializedPercentage);
        return {
            labels: [`Serialized ${serializedPercentage}%`, `Not Serialized ${notSerializedPercentage}%`],
            datasets: [{
                data: [this.state.snapshot['statistics'].countClassesSerialized, this.state.snapshot['statistics'].countClassesNotSerialized],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB'
                ]
            }]
        };
    }

    fetchSnapshot = () => {
        const id = this.props.match.params.id;

        const query = queryString.stringify(this.state.queries);
        axios.get('http://localhost:4488/api/v1/snapshots/' + id + `?${query}`)
            .then(response => {
                console.log(response);
                if (response.data != null) {
                    this.setState({ snapshot: response.data })
                }
            })
    }


    componentDidMount = () => {
        this.fetchSnapshot();
    }

    render() {

        return (
            <div className="container mt-5">
                <Link to="/snapshots" className="btn btn-primary">Back</Link>
                <div className="row p-2 mt-5 mb-5">
                    <div className="col-md-6">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th colSpan="2">Snapshot: {this.state.snapshot.date}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th style={{ width: "43%" }}>Files</th>
                                    <td>{this.state.snapshot['statistics'].countFiles}</td>
                                </tr>
                                <tr>
                                    <th>Classes</th>
                                    <td>{this.state.snapshot['statistics'].countClasses}</td>
                                </tr>
                                <tr>
                                    <th>Serialized Classes</th>
                                    <td>{this.state.snapshot['statistics'].countClassesSerialized}</td>
                                </tr>
                                <tr>
                                    <th>Not Serialized Classes</th>
                                    <td>{this.state.snapshot['statistics'].countClassesNotSerialized}</td>
                                </tr>
                                <tr>
                                    <th>Auto Serialized</th>
                                    <td>{this.state.snapshot['statistics'].countReplacements}</td>
                                </tr>
                                <tr>
                                    <th>Options</th>
                                    <td>{JSON.stringify(this.state.snapshot['options'])}</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-6">
                        <Pie data={this.getPieData()}></Pie>
                    </div>
                </div>

                <h2>Files</h2>
                {this.state.snapshot['files'].map((item, i) => {

                    return <div key={i} className="file-classes border row mt-2">
                        <div className="col-md-12 p-2">
                            <div className="p-1"><i className="fa fa-file"></i> <a href={`/snapshots/${this.props.match.params.id}/file/${encodeURIComponent(item.file)}`} target="_blank">{item.file}</a> <small>({item.countClasses} classes)</small></div>
                            {item.classes.map((cls, i) => {
                                return <div key={i} className="class-found border p-2 mt-1">
                                    <small>Line: {cls.lineNumber+2}</small>
                                    <div className="line-diff ">
                                        <SyntaxHighlighter
                                            style={docco}
                                            language="java"
                                            wrapLines={true}
                                            lineProps={lineNumber => ({
                                                style: { display: 'block', backgroundColor: '#ffecec'},
                                            })}
                                        >
                                            {cls.original}
                                        </SyntaxHighlighter>

                                        <SyntaxHighlighter
                                            style={docco}
                                            language="java"
                                            wrapLines={true}
                                            lineProps={lineNumber => ({
                                                style: { display: 'block', backgroundColor: '#dbffdb'},
                                            })}
                                        >
                                            {(cls.replacement != null)? cls.replacement : ''}
                                        </SyntaxHighlighter>

                                    </div>
                                </div>

                            })}
                        </div>
                    </div>
                })}



            </div>
        );
    }
}

export default ViewSnapshotPage;
import React, { Component } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import axios from 'axios';

class ViewFile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filePath: "",
            fileContent: ""
        }
    }


    fetchContentFile = () => {
        const id = this.props.match.params.id;
        axios.get('http://localhost:4488/api/v1/snapshots/' + id + `/file/${this.props.match.params.path}`)
            .then(response => {
                if (response.data != null) {
                    this.setState({ fileContent: response.data })
                }
            })
    }


    componentDidMount = () => {
        this.setState({filePath: decodeURIComponent(this.props.match.params.path)})
        this.fetchContentFile();
    }

    render() {
        return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-12 border p-2">
                    <h5 style={{fontSize: "17px;"}}>{this.state.filePath}</h5>
                    <SyntaxHighlighter
                        style={docco}
                        language="java"
                        showLineNumbers={true}
                    >
                        {this.state.fileContent}
                    </SyntaxHighlighter>
                    </div>
                    
                </div>
            </div>
        );
    }
}

export default ViewFile;
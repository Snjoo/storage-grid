import React, { Component } from 'react';
import logo from './assembly.png';
import './App.css';

class StorageGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: 'A1',
      inputText: '',
      lastScanned: '',
      addToGrid: false,
      grid: [],
      foundCategory: null,
      addedToGrid: false
    }
  }
  componentDidMount() {
    const cachedData = localStorage.getItem('storageGrid');
    console.log(cachedData)
    if (cachedData) {
      this.setState({ grid: JSON.parse(cachedData) });
      return;
    }
  }
  onScan(event) {
    event.preventDefault()
    this.state.grid.map(category => {
      if(category.serials.findIndex(k => k === this.state.inputText) !== -1) {
        this.setState({foundCategory: category.name})
        return
      }
    })
    if (this.state.addToGrid && !this.state.foundCategory) {
      const newGrid = [{name: 'A1', serials: ['ASDASD', 'BKBKBKKB']}]
      this.setState({grid: newGrid})
      localStorage.setItem('storageGrid', JSON.stringify(newGrid));
    }
    this.setState({lastScanned: this.state.inputText})
    this.setState({
      inputText: '',
      addedToGrid: false
    })
  }
  render() {
    return (
      <div className="storageGrid">
        <header className="header">
          <img src={logo} className="logo" alt="logo" />
          <h1 className="title">Storage grid</h1>
        </header>
        <form onSubmit={(e) => this.onScan(e)}>
          <div className="scan">
            <input
              type="text"
              className="categoryInput"
              value={this.state.category}
              onChange={(event) => this.setState({category: event.target.value})}
            />
            <input
              type="text"
              className="scanInput"
              placeholder="Serial number"
              value={this.state.inputText}
              onChange={(event) => this.setState({
                inputText: event.target.value,
                foundCategory: null
              })}
            />
            <button className="scanButton">Scan</button>
          </div>
          <div className="addToGrid">
            <label className="addCheckBoxLabel" htmlFor="addCheckBox">Add to grid</label>
            <input className="addCheckBox" id="addToGrid" type="checkbox" value={this.state.addToGrid} onChange={(e) => this.setState({addToGrid: e.target.value})}></input>
          </div>
        </form>
        {this.state.lastScanned && <p>Scanned serialnumber {this.state.lastScanned}</p>}
        {this.state.lastScanned && !this.state.addedToGrid && this.state.foundCategory && <p>Found in category {this.state.foundCategory}</p>}
        {this.state.lastScanned && !this.state.addedToGrid && !this.state.foundCategory && <p>{this.state.lastScanned} not found</p>}
        {this.state.lastScanned && this.state.addedToGrid && <p>{this.state.lastScanned} added to category {this.state.category}</p>}
        {this.state.grid.map(category => {
          const categorySerials = category.serials ? category.serials.map(serial => <p className="gridSerial" key={serial}>{serial}</p>) : null
          return (
            <div className="showGrid">
              <p className="gridCategoryName">{category.name}</p>
              {categorySerials}
            </div>
          )}
        )}
      </div>
    );
  }
}

export default StorageGrid;

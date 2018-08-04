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
    this.scanInput.focus()
    const cachedData = localStorage.getItem('storageGrid');
    if (cachedData) {
      this.setState({ grid: JSON.parse(cachedData) });
      return;
    }
  }
  serialExists(serial) {
    let found = false
    this.state.grid.map(category => {
      if(category.serial === serial) {
        found = true
      }
      return null
    })
    return found
  }
  onScan(event) {
    event.preventDefault()
    this.setState({addedToGrid: false, foundCategory: null})
    this.state.grid.map(category => {
      if(category.serial === this.state.inputText) {
        this.setState({foundCategory: category.name})
        return true
      }
      return true
    })
    if (this.state.addToGrid && !this.state.foundCategory) {
      let newGrid = this.state.grid
      if(!this.serialExists(this.state.inputText) && this.state.inputText.length > 0) {
        newGrid.push({name: this.state.category, serial: this.state.inputText})
        this.setState({grid: newGrid, addedToGrid: true})
        localStorage.setItem('storageGrid', JSON.stringify(newGrid));
      }
    }
    this.setState({lastScanned: this.state.inputText})
    this.setState({
      inputText: ''
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
              onChange={(event) => this.setState({category: event.target.value, foundCategory: null})}
            />
            <input
              type="text"
              className="scanInput"
              placeholder="Serial number"
              ref={(input) => {this.scanInput = input}}
              value={this.state.inputText}
              onChange={(event) => this.setState({
                inputText: event.target.value
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
        {this.state.lastScanned && !this.state.addedToGrid && this.state.foundCategory && <p className="foundText">Found in category {this.state.foundCategory}</p>}
        {this.state.lastScanned && !this.state.addedToGrid && !this.state.foundCategory && <p>{this.state.lastScanned} not found</p>}
        {this.state.lastScanned && this.state.addedToGrid && <p>{this.state.lastScanned} added to category {this.state.category}</p>}
          {this.state.grid.slice(-10).reverse().map(category => {
            return (
              <div className="showGrid" key={category.serial}>
                <p className="gridCategoryName">{category.name}</p>
                <p className="gridSerial">{category.serial}</p>
              </div>
            )}
          )}
      </div>
    );
  }
}

export default StorageGrid;

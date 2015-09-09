import React from 'react';
import {Dispatcher, State, Store} from 'phrontend';

// Define action types
const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

// Define action creators
let increment = step => Dispatcher.dispatch(INCREMENT_COUNTER, step);
let decrement = step => Dispatcher.dispatch(DECREMENT_COUNTER, step);

class CounterStore extends Store {
  handler(payload) {
    switch(payload.actionType) {
      case INCREMENT_COUNTER:
      // increment the counter to the absolute value of the data sent
      this.set('count', this.get('count') + payload.data);
      // and emit the change event for the subscribers (views) to update themselves
      this.emitChange();
      break;
      case DECREMENT_COUNTER:
      // decrement
      this.set('count', this.get('count') - payload.data);
      // and inform the subscribers
      this.emitChange();
    }
  }
}

const initialState = {
  count: 0
};

let counterStore = new CounterStore(initialState);

class Counter extends React.Component {
  constructor(...args) {
    super(...args);
    this.handleChange = this.handleChange.bind(this);
    this.handleStepChange = this.handleStepChange.bind(this);
    this.state = {
      step: 1,
      count: 0,
    };
  }
  // when the component mounts
  componentDidMount() {
    // subscribe to the change events published by the store this view
    // wants to listen to
    counterStore.subscribe(this.handleChange);
  }
  // and when the component will be remove
  componentWillUnmount() {
    // cleanup
    // unsubscribe from the store
    counterStore.unsubscribe(this.handleChange);
  }
  // handle the change emitted by the store
  handleChange() {
    // change count obtained from the store
    this.setState({
      // .get is synchronous
      count: counterStore.get('count')
    });
  }
  handleStepChange(e) {
    // this is to maintain the step value
    this.setState({
      step: e.target.value ? parseInt(e.target.value) : 0
    });
  }
  render() {
    let buttonStyle = {
      margin: 5,
      fontSize: 20,
    };
    return <div>
      Current Value: {this.state.count}
      <div>
        <button style={buttonStyle} onClick={decrement.bind(null, this.state.step)}>-</button>
        <button style={buttonStyle} onClick={increment.bind(null, this.state.step)}>+</button>
      </div>
      <div>Step : <input onChange={this.handleStepChange} value={this.state.step}/></div>
    </div>;
  }
}

window.addEventListener('DOMContentLoaded', function() {
  React.render(<Counter/>, document.getElementById('counter-container'));
});

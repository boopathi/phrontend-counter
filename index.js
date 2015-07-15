import React from 'react';
import {Dispatcher, State, Store} from 'phrontend';

// Define action types
const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

// Define action creators
let increment = data => Dispatcher.dispatch(INCREMENT_COUNTER, data);
let decrement = data => Dispatcher.dispatch(DECREMENT_COUNTER, data);

// Define the state of the counter
let CounterState = State.extend({
  props: {
    count: 'number'
  }
});

// and create your flux store
let CounterStore = Store.create({
  state: CounterState,
  handler(payload) {
    // handle initial state
    if (!this.get('count')) this.set('count', 0);
    // this function will be executed in the context of the state's instance
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
});

class Counter extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      step: 1,
      count: 0,
    }
  }
  // when the component mounts
  componentDidMount() {
    // subscribe to the change events published by the store this view
    // wants to listen to
    CounterStore.subscribe(this.handleChange.bind(this));
  }
  // and when the component will be remove
  componentWillUnmount() {
    // cleanup
    // unsubscribe from the store
    CounterStore.unsubscribe(this.handleChange.bind(this));
  }
  // handle the change emitted by the store
  handleChange() {
    // change count obtained from the store
    this.setState({
      // .get is synchronous
      count: CounterStore.get('count')
    });
  }
  handleStepChange(e) {
    // this is to maintain the step value
    this.setState({
      step: e.target.value ? parseInt(e.target.value) : 0
    });
  }
  increment() {
    // call the increment action creator
    increment(this.state.step);
  }
  decrement() {
    // call the decrement action creator
    decrement(this.state.step);
  }
  render() {
    let buttonStyle = {
      margin: 5,
      fontSize: 20,
    };
    return <div>
      Current Value: {this.state.count}
      <div>
        <button style={buttonStyle} onClick={this.decrement.bind(this)}>-</button>
        <button style={buttonStyle} onClick={this.increment.bind(this)}>+</button>
      </div>
      <div>Step : <input onChange={this.handleStepChange.bind(this)} value={this.state.step}/></div>
    </div>;
  }
}

window.addEventListener('DOMContentLoaded', function() {
  React.render(<Counter/>, document.getElementById('counter-container'));
});

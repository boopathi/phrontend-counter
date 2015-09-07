import React from 'react';
import {Dispatcher, createStore} from 'phrontend';

// Define action types
const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

// Define action creators
let increment = data => Dispatcher.dispatch(INCREMENT_COUNTER, data);
let decrement = data => Dispatcher.dispatch(DECREMENT_COUNTER, data);

// and create your flux store
function handler(payload, state) {
  // handle initial state
  if (!state.get('count')) state.set('count', 0);
  // state function will be executed in the context of the state's instance
  switch(payload.actionType) {
    case INCREMENT_COUNTER:
    // increment the counter to the absolute value of the data sent
    // state.set('count', state.get('count') + payload.data);
    state.set({
      count: state.get('count') + payload.data
    });
    // and emit the change event for the subscribers (views) to update themselves
    state.emitChange();
    break;
    case DECREMENT_COUNTER:
    // decrement
    state.set('count', state.get('count') - payload.data);
    // and inform the subscribers
    state.emitChange();
  }
}

let CounterStore = createStore(handler, {});

class Counter extends React.Component {
  constructor(...args) {
    super(...args);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      step: 1,
      count: 0,
    }
  }
  // when the component mounts
  componentDidMount() {
    // subscribe to the change events published by the store this view
    // wants to listen to
    CounterStore.subscribe(this.handleChange);
  }
  // and when the component will be remove
  componentWillUnmount() {
    // cleanup
    // unsubscribe from the store
    CounterStore.unsubscribe(this.handleChange);
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

import React, { Component } from 'react';

const matcher = {
  "checkbox": event => event.target.checked,
  "text": event => event.target.value
};
export default class Form extends Component {
  timeout = null;
  componentWillUnmount = () => clearTimeout(this.timeout);
  onChange = event => {
    clearTimeout(this.timeout);
    event.persist();
    this.timeout = setTimeout( () => {
      const name = event.target.name,
            type = event.target.type,
            value = matcher[type] ? matcher[type](event) : null;
      if (name && value){
        this.setState({ [name]: value}, () => console.dir(this.state))
      }
    }, 175)
  };

  render = () => (
    <form onChangeCapture={this.onChange} name={"my_form"}>
      {this.props.children}
    </form>
  )
}
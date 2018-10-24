import React, { Component } from 'react';
import { Nav, NavLink } from 'reactstrap';

export default class Navigation extends Component {
  render() {
    return (
      <Nav>
        <NavLink
          style={{ paddingLeft: 0 }}
          href="https://github.com/jonathanbell/qt-stock-watch"
        >
          Documentation
        </NavLink>{' '}
        {/* <NavLink href="#">Another Link</NavLink>{' '} */}
      </Nav>
    );
  }
}

import React, { Component } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';

export default class Navigation extends Component {
  render() {
    return (
      <Nav>
        <NavLink href="https://github.com/jonathanbell/qt-stock-watch">
          Documentation
        </NavLink>{' '}
        {/* <NavLink href="#">Another Link</NavLink>{' '} */}
      </Nav>
    );
  }
}

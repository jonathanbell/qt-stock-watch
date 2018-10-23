import React, { Component } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';

export default class Navigation extends Component {
  render() {
    return (
      <Nav>
        <NavLink href="#">Link</NavLink> <NavLink href="#">Link</NavLink>{' '}
        <NavLink href="#">Another Link</NavLink>{' '}
        <NavLink disabled href="#">
          Disabled Link
        </NavLink>
      </Nav>
    );
  }
}

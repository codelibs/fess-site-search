var React = require('react');
var ReactDOM = require('react-dom');
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import { Collapse, Navbar, NavbarToggler, NavbarBrand } from 'reactstrap';
import classnames from 'classnames';

export default class FSSNavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      activeNav: '1'
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div>
        <Navbar className="navbar-dark bg-dark" expand="lg">
          <NavbarBrand href="/">FSS JS Generator</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeNav === '1' })}
                  onClick={() => { this.toggle('1'); }}
                  href="/">
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeNav === '2' })}
                  onClick={() => { this.toggle('2'); }}
                  href="/docs/manual">
                  User Manual
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="http://fess.codelibs.org/">Fess Docs</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

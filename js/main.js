var React = require('react');
var ReactDOM = require('react-dom');
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import { Collapse, Navbar, NavbarToggler, NavbarBrand } from 'reactstrap';
import classnames from 'classnames';
import FSSNavBar from './navbar.js';
require('!style-loader!css-loader!' + '../node_modules/bootstrap/dist/css/bootstrap.css');

class GenerateButton extends React.Component {
  render () {
    return (
      <div className="form-group">
        <Button color="primary" size="large" type="submit">{'Generate'}</Button>
      </div>
    );
  }
}

class WizardFormContent extends React.Component {
  render () {
    return (
      <form method="post" encType="multipart/form-data">
        <div className="form-horizontal">
          <div className="form-group row">
            <label htmlFor="bg-color" className="col-2 col-form-label-lg">Background</label>
            <div className="col-10">
              <input type="text" className="form-control" name="bg-color" id="bg-color" aria-describedby="bg-colorhelp" placeholder="#fafafa" maxLength="7"></input>
              <small id="bg-colorhelp" className="form-text text-muted">Background Color</small>
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="button-color" className="col-2 col-form-label-lg">Button</label>
            <div className="col-10">
              <input type="text" className="form-control" name="button-color" id="button-color" aria-describedby="button-colorhelp" placeholder="#fafafa" maxLength="7"></input>
              <small id="button-colorhelp" className="form-text text-muted">Button Color</small>
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="fess-version" className="col-2 col-form-label-lg">Version</label>
            <select name="fess-version"  className="custom-select form-control-lg">
              <option value="11.4">Fess 11.4</option>
              <option value="11.3">Fess 11.3</option>
            </select>
          </div>
        </div>
        <GenerateButton />
      </form>
    );
  }
}

class CSSFormContent extends React.Component {
  render () {
    return (
      <form method="post" encType="multipart/form-data">
        <div className="form-horizontal">
          <div className="form-group row">
            <label htmlFor="file" className="col-2 col-form-label-lg">CSS</label>
            <input type="file" name="file" className="form-control-file form-control-lg"></input>
          </div>
          <div className="form-group row">
            <label htmlFor="fess-version" className="col-2 col-form-label-lg">Version</label>
            <select name="fess-version"  className="custom-select form-control-lg">
              <option value="11.4">Fess 11.4</option>
              <option value="11.3">Fess 11.3</option>
            </select>
          </div>
        </div>
        <GenerateButton />
      </form>
    );
  }

}

class DesignTabs extends React.Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render () {
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
              >
              Wizard
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
              >
              Upload CSS
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <WizardFormContent />
          </TabPane>
          <TabPane tabId="2">
            <CSSFormContent />
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

class Jumbotron extends React.Component {
  render () {
    return (
      <div className="jumbotron jumbotron-fluid">
        <div className="container">
          <h1 className="display-3">FSS JS Generator</h1>
          <h2 className="display-5">Generate a JavaScript file for Fess Site Search</h2>
        </div>
      </div>

    );
  }

}
class TopPage extends React.Component {
  render () {
    return (
      <div>
        <FSSNavBar />
        <div className="container theme-showcase" role="main">
          <Jumbotron />
          <DesignTabs />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <TopPage />,
  document.getElementById('root')
);

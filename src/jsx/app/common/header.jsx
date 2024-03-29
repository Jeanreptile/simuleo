var Router = require('react-router'),
{ Route, RouteHandler, Link } = Router;

var Brand = React.createClass({
  render: function() {
    return (
      <NavHeader {...this.props}>
        <NavBrand tabIndex='-1'>
          <img src='/imgs/logo2.png' alt='rubix' width='168' height='40' />
        </NavBrand>
      </NavHeader>
    );
  }
});

var Navigation = React.createClass({
  mixins: [ReactRouter.State, ReactRouter.Navigation],
  render: function() {
    var props = React.mergeProps({
      className: 'pull-right'
    }, this.props);

    return (
      <NavContent {...props}>
        <Nav>
          <NavItem>
                  <Link to='/logout'><Icon bundle='fontello' glyph='off-1' /></Link>
          </NavItem>

        </Nav>
      </NavContent>
    );
  }
});

var Header = React.createClass({
  render: function() {
    return (
      <Grid {...this.props} id='navbar'>
        <Row>
          <Col xs={12}>
            <NavBar fixedTop id='rubix-nav-header'>
              <Container fluid>
                <Row>
                  <Col xs={3} visible='xs'>
                    <SidebarBtn />
                  </Col>
                  <Col xs={6} sm={4}>
                    <Brand />
                  </Col>
                  <Col xs={3} sm={8}>
                    <Navigation />
                  </Col>
                </Row>
              </Container>
            </NavBar>
          </Col>
        </Row>
      </Grid>
    );
  }
});

module.exports = Header;

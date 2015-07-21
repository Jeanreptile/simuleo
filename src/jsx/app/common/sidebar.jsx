var auth = require('../services/auth');

var ApplicationSidebar = React.createClass({
  render: function() {

    //detect if student or prof
    if(this.props.user.type == "prof") {
      navItems = <SidebarNav style={{marginBottom: 0}}><SidebarNavItem glyph='icon-fontello-gauge' name='Dashboard' href='/' />
              <SidebarNavItem glyph='icon-ikons-grid-1' name='Simulations' href='/simulations' />
              <SidebarNavItem glyph='icon-stroke-gap-icons-Files' name='Mes classes' href='/classes' /></SidebarNav>;

    }
    else {
      navItems = <SidebarNav style={{marginBottom: 0}}><SidebarNavItem glyph='icon-ikons-grid-1' name='Mes Simulations' href='/simulations' />
      </SidebarNav>;
    }

    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <div className='sidebar-header'>PAGES</div>
              <div className='sidebar-nav-container'>
                  {navItems}
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

var DummySidebar = React.createClass({
  render: function() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <div className='sidebar-header'>DUMMY SIDEBAR</div>
            <LoremIpsum query='1p' />
          </Col>
        </Row>
      </Grid>
    );
  }
});

var SidebarSection = React.createClass({
  render: function() {
    var user = auth.getUser();
    return (
      <div id='sidebar' {...this.props}>
        <div id='avatar'>
          <Grid>
            <Row className='fg-white'>
              <Col xs={4} collapseRight>
                <img src='/imgs/avatars/avatarfin.png' width='40' height='40' />
              </Col>
              <Col xs={8} collapseLeft id='avatar-col'>
                <div style={{top: 23, fontSize: 16, lineHeight: 1, position: 'relative'}}>{user.first_name} {user.last_name} </div>
              </Col>
            </Row>
          </Grid>
        </div>
            <ApplicationSidebar user={user}/>
      </div>
    );
  }
});

module.exports = SidebarSection;

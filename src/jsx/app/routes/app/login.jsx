var Header = require('../../common/header.jsx');
var Sidebar = require('../../common/sidebar.jsx');
var Footer = require('../../common/footer.jsx');
var auth = require('../services/auth');
var RedirectWhenLoggedIn = require('../mixins/redirect_when_logged_in');



var Body = React.createClass({
  mixins:[React.addons.LinkedStateMixin],
  getStateFromFlux: function() {
    var flux = this.getFlux();
    return {
      images: flux.store("ImageStore").getState(),
      carousel: flux.store("CarouselStore").getState()
    };
  },

  getInitialState: function() {
    return { email: "", password: "" };
  },
  login: function(e) {
    e.preventDefault();
   // Here, we call an external AuthService. We’ll create it in the next step
   /*
   Auth.login(this.state.user, this.state.password)
     .catch(function(err) {
       console.log(“Error logging in”, err);
     });*/
  },
  componentDidMount: function() {
    $('html').addClass('authentication');
  },
  componentWillUnmount: function() {
    $('html').removeClass('authentication');
  },
  login: function(e){
    e.preventDefault();
    $.post( "/api/login/", {username: this.state.email, password: this.state.password}, function(result) {
      }.bind(this))
      .done(function(result) {
        console.log("Ok !" + result.jwt);
        this.getFlux().actions.loginUser(result.jwt)
      }.bind(this))
      .fail(function(error) {
      }.bind(this));
  },
  render: function() {
    return (
      <Container id='auth-container' className='login'>
        <Container id='auth-row'>
          <Container id='auth-cell'>
            <Grid>
              <Row>
                <Col sm={12}>
                  <PanelContainer noControls>
                    <Panel>
                      <PanelBody style={{padding: 0}}>
                        <div className='text-center bg-darkblue fg-white'>
                          <h3 style={{margin: 0, padding: 25}}>Se connecter à Simuleo</h3>
                        </div>
                        <div>
                          <div style={{padding: 25, paddingTop: 0, paddingBottom: 0, margin: 'auto', marginBottom: 25, marginTop: 25}}>
                            <Form onSubmit={this.back}>
                              <FormGroup>
                                <InputGroup lg>
                                  <InputGroupAddon>
                                    <Icon glyph='icon-fontello-mail' />
                                  </InputGroupAddon>
                                  <Input autoFocus valueLink={this.linkState('email')} type='email' id='emailaddress' className='border-focus-blue' placeholder='monadresse@mail.com' />
                                </InputGroup>
                              </FormGroup>
                              <FormGroup>
                                <InputGroup lg>
                                  <InputGroupAddon>
                                    <Icon glyph='icon-fontello-key' />
                                  </InputGroupAddon>
                                  <Input type='password' valueLink={this.linkState('password')} id='password' className='border-focus-blue' placeholder='password' />
                                </InputGroup>
                              </FormGroup>
                              <FormGroup>
                                <Grid>
                                  <Row>
                                    <Col xs={6} collapseLeft collapseRight style={{paddingTop: 10}}>
                                      <Link to='/app/signup'>Créer un compte</Link>
                                    </Col>
                                    <Col xs={6} collapseLeft collapseRight className='text-right'>
                                      <Button outlined lg type='submit' bsStyle='blue' onClick={this.login.bind(this)}>Login</Button>
                                    </Col>
                                  </Row>
                                </Grid>
                              </FormGroup>
                            </Form>
                          </div>
                        </div>
                      </PanelBody>
                    </Panel>
                  </PanelContainer>
                </Col>
              </Row>
            </Grid>
          </Container>
        </Container>
      </Container>
    );
  }
});

var classSet = React.addons.classSet;
var LoginPage = React.createClass({
  mixins: [SidebarMixin],
  render: function() {
    var classes = classSet({
      'container-open': this.state.open
    });
    return (
      <Container id='container' className={classes}>
        <Body />
      </Container>
    );
  }
});

module.exports = LoginPage;

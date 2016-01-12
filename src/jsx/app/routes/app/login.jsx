var Header = require('../../common/header.jsx');
var Sidebar = require('../../common/sidebar.jsx');
var Footer = require('../../common/footer.jsx');
var auth = require('../../services/auth');
var RedirectWhenLoggedIn = require('../../mixins/redirect_when_logged_in');

var React = require('react'),
    Router = require('react-router'),
    { Route, RouteHandler, Link } = Router;


var Body = React.createClass({
  mixins: [ Router.Navigation, React.addons.LinkedStateMixin],
  statics: {
    attemptedTransition: null
  },
  getStateFromFlux: function() {
    var flux = this.getFlux();
    return {
      images: flux.store("ImageStore").getState(),
      carousel: flux.store("CarouselStore").getState()
    };
  },

  getInitialState: function() {
    return { email: "", password: "", error: ""};
  },
  componentDidMount: function() {
    $('html').addClass('authentication');
  },
  componentWillUnmount: function() {
    $('html').removeClass('authentication');
  },
  login: function(e){
    e.preventDefault();
    auth.login(this.state.email, this.state.password, function (loggedIn, errors) {
     if (!loggedIn)
       return this.setState({ error: errors });
     if (Body.attemptedTransition) {
       var transition = Body.attemptedTransition;
       Body.attemptedTransition = null;
       transition.retry();
     } else {
       this.replaceWith('/simul_model'); // jump after login
     }
   }.bind(this));
  },
  render: function() {
    var errors = this.state.error ? <p>Mauvaises informations de connexion.<br /> {this.state.error}</p> : '';
    return (
      <Container id='auth-container'>
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
                                      <Link to='/signup'>Créer un compte</Link>
                                    </Col>
                                    <Col xs={6} collapseLeft collapseRight className='text-right'>
                                      <Button outlined lg type='submit' bsStyle='blue' onClick={this.login}>Se connecter</Button>
                                    </Col>
                                    {errors}
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
  mixins: [SidebarMixin, RedirectWhenLoggedIn],
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

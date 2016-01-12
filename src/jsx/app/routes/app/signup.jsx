var Header = require('../../common/header.jsx');
var Sidebar = require('../../common/sidebar.jsx');
var Footer = require('../../common/footer.jsx');

var auth = require('../../services/auth');
var Fluxxor = require('../../../../../node_modules/fluxxor');
var ReactStyle = require('../../react-styles/src/ReactStyle.jsx');

var React = require('react'),
    Router = require('react-router'),
    { Route, RouteHandler, Link } = Router

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Body = React.createClass({
  mixins: [FluxMixin,Router.Navigation, StoreWatchMixin("UserStore"), React.addons.LinkedStateMixin],
  statics: {
    attemptedTransition: null
  },
  getInitialState: function() {
    return { email: "", firstname: "", lastname: "", type: "", password:"", password2:"" };
  },
  getStateFromFlux: function() {
    console.log(this.getFlux());
    var store = this.getFlux().store("UserStore");
    return {
      loading: store.loading,
      finished: store.finished,
      info: store.info
    };
  },
  signup: function(e){
    e.preventDefault();
    var myRadio = $('input[name=radiotype]:checked');
    if (this.state.email === "" || this.state.password === "" || this.state.firstname === "" || this.state.lastname === "")
      return this.setState({error: "Vous devez remplir tous les champs."})
    else {
      auth.signup(this.state.email, this.state.password, this.state.firstname, this.state.lastname, myRadio.val(), function (loggedIn, errors) {
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
    }
  },
  render: function() {
    var errors = this.state.error ? <p>Mauvaises informations de connexion.<br /> {this.state.error}</p> : '';
    return (
      <Container id='auth-container' className='signup'>
        <Container id='auth-row'>
          <Container id='auth-cell'>
            <Grid>
              <Row>
                <Col sm={12}>
                  <PanelContainer noControls>
                    <Panel>
                      <PanelBody style={{padding: 0}}>
                        <div className='text-center bg-darkblue fg-white'>
                          <h3 style={{margin: 0, padding: 25}}>Création de compte</h3>
                        </div>
                        {errors}
                        <div>
                          <div style={{padding: 25, paddingTop: 0, paddingBottom: 0, margin: 'auto', marginBottom: 25, marginTop: 25}}>
                            <Form onSubmit={this.back}>
                              <FormGroup>
                                <InputGroup lg>
                                  <InputGroupAddon>
                                    <Icon glyph='icon-fontello-mail' />
                                  </InputGroupAddon>
                                  <Input type='email' valueLink={this.linkState('email')} id='emailaddress' className='border-focus-blue' placeholder='adresse@email.com' />
                                </InputGroup>
                              </FormGroup>
                              <FormGroup>
                                <InputGroup lg>
                                  <InputGroupAddon>
                                    <Icon glyph='icon-fontello-key' />
                                  </InputGroupAddon>
                                  <Input type='password' valueLink={this.linkState('password')} id='password' className='border-focus-blue' placeholder='Mot de passe' />
                                </InputGroup>
                              </FormGroup>
                              <FormGroup>
                                <InputGroup lg>
                                  <InputGroupAddon>
                                    <Icon glyph='icon-fontello-user' />
                                  </InputGroupAddon>
                                  <Input autoFocus type='text' valueLink={this.linkState('firstname')} id='firstname' className='border-focus-blue' placeholder='Prénom' />
                                </InputGroup>
                              </FormGroup>
                              <FormGroup>
                                <InputGroup lg>
                                  <InputGroupAddon>
                                    <Icon glyph='icon-fontello-user' />
                                  </InputGroupAddon>
                                  <Input autoFocus type='text' valueLink={this.linkState('lastname')} id='lastname' className='border-focus-blue' placeholder='Nom de famille' />
                                </InputGroup>
                              </FormGroup>
                              <FormGroup>
                                <InputGroup lg>
                                  <InputGroupAddon>
                                    <Label control>Type</Label>
                                  </InputGroupAddon>
                                  <Col sm={9}>
                                    <Radio value='student' defaultChecked name='radiotype'>
                                      Élève
                                    </Radio>
                                    <Radio value='prof' name='radiotype'>
                                      Professeur
                                    </Radio>
                                  </Col>
                                </InputGroup>
                              </FormGroup>
                              <FormGroup>
                                <Grid>
                                  <Row>
                                    <Col xs={6} collapseLeft collapseRight style={{paddingTop: 10}}>
                                      <Link to='/login'>Déjà un compte ?</Link>
                                    </Col>
                                    <Col xs={6} collapseLeft collapseRight className='text-right'>
                                      <Button type='submit' outlined lg bsStyle='blue' block onClick={this.signup}>Créer le compte</Button>
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
  },
  handleChangeInfo: function(e) {
    if(e.target.name == 'email')
      this.setState({email: e.target.value});
    if(e.target.name == 'firstname')
      this.setState({firstname: e.target.value});
    if(e.target.name == 'lastname')
      this.setState({lastname: e.target.value});
    if(e.target.name == 'type')
      this.setState({type: e.target.value});
    if(e.target.name == 'password')
      this.setState({password: e.target.value});
    if(e.target.name == 'password2')
      this.setState({password2: e.target.value});
  },
});

var Page = React.createClass({
  mixins: [FluxMixin, SidebarMixin],
  render: function() {
    var classes = React.addons.classSet({
      'container-open': this.state.open
    });
    return (
      <Container id='container' className={classes}>
        <Body />
      </Container>
    );
  }
});

module.exports = Page;

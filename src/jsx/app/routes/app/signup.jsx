var Header = require('../../common/header.jsx');
var Sidebar = require('../../common/sidebar.jsx');
var Footer = require('../../common/footer.jsx');

var Fluxxor = require('../../../../../node_modules/fluxxor');
var ReactStyle = require('../../react-styles/src/ReactStyle.jsx');

window.React = React;

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Body = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("UserStore")],
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
  handleSubmit: function(e) {
    e.preventDefault();
    console.log("SUBMIT");
    this.getFlux().actions.addUser(
      this.state.email,
      this.state.firstname,
      this.state.lastname,
      this.state.type,
      this.state.password);
    // if (!text || !author) {
    //   return;
    // }
    // // TODO: send request to the server
    // React.findDOMNode(this.refs.author).value = '';
    // React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function() {
    return (
      <Container id='body'>
        <Grid>
          <Row>
            <Col sm={12}>
              <PanelContainer>
                <Panel>
                  <PanelBody className='text-center'>
                    <h1>Création de compte</h1>
                    <p>Veuillez compléter ces informations.</p>
                    <Form id='form-2' onSubmit={this.handleSubmit}>
                      <Grid>
                        <Row>
                          <Col sm={4} xs={6} collapseRight className='form-border'>
                            <FormGroup>
                              <Label htmlFor='email'>Email</Label>
                              <Input type='text' id='email' name='email' className='required'
                                value={this.state.email} onChange={this.handleChangeInfo}/>
                            </FormGroup>
                            <FormGroup>
                              <Label htmlFor='firstname'>Prénom</Label>
                              <Input type='text' id='firstname' name='firstname' className='required'
                                value={this.state.firstname} onChange={this.handleChangeInfo}/>
                            </FormGroup>
                            <FormGroup>
                              <Label htmlFor='lastname'>Nom</Label>
                              <Input type='text' id='lastname' name='lastname' className='required'
                                value={this.state.lastname} onChange={this.handleChangeInfo}/>
                            </FormGroup>
                          </Col>
                          <Col sm={4} xs={6} collapseRight className='form-border'>
                            <FormGroup>
                              <Label htmlFor='password'>Mot de passe</Label>
                              <Input type='text' id='password' name='password' className='required'
                                value={this.state.password} onChange={this.handleChangeInfo}/>
                            </FormGroup>
                            <FormGroup>
                              <Label htmlFor='password2'>Confirmer le mot de passe</Label>
                              <Input type='text' id='password2' name='password2' className='required'
                                value={this.state.password2} onChange={this.handleChangeInfo}/>
                            </FormGroup>
                            <input type="submit" value="Valider" />
                          </Col>
                        </Row>
                      </Grid>
                    </Form>
                  </PanelBody>
                </Panel>
              </PanelContainer>
            </Col>
          </Row>
        </Grid>
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
  mixins: [SidebarMixin],
  render: function() {
    var classes = React.addons.classSet({
      'container-open': this.state.open
    });
    return (
      <Container id='container' className={classes}>
        <Body flux={flux} />
      </Container>
    );
  }
});

module.exports = Page;

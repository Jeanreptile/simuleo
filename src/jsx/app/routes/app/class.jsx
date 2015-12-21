var Header = require('../../common/header.jsx');
var Sidebar = require('../../common/sidebar.jsx');
var Footer = require('../../common/footer.jsx');

var Fluxxor = require('../../../../../node_modules/fluxxor');
var Authentication = require('../../mixins/authentication');

var auth = require('../../services/auth');


window.React = React;


var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Body = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ClasseStore")],
  getInitialState: function() {
    return { newClasse: {} };
  },

  getStateFromFlux: function() {
    var store = this.getFlux().store("ClasseStore");
    return {
      loading: store.loading,
      error: store.error,
      classes: _.values(store.classes)
    };
  },

  render: function() {
    return (
      <Container id='body'>
        <Grid>
          <h1 className="text-center"> <Icon glyph='icon-flatline-pencil'/> Edit Class &nbsp;
            <a href='/simul/create' class="a-button">
              <Button bsStyle='danger' url='/simul/create'>
                Delete
              </Button>
            </a>
          </h1>
          <Row>
            <Col sm={6} smCollapseRight>
              <PanelContainer>
                <Panel>
                  <PanelBody>
                    <Grid>
                      <Row>
                        <Col xs={12}>
                          <FormGroup>
                            <Label htmlFor='emailaddress'>Name</Label>
                            <InputGroup>
                              <Input autoFocus type='text' id='nameclass' value='GITM 2016' />
                            </InputGroup>
                          </FormGroup>
                          <FormGroup>
                            <Label htmlFor='dropdownselect'>Students</Label>
                              <InputGroup>
                                <Select id='dropdownselect' defaultValue='1'>
                                  <option value='1'>Bernard Claffouti</option>
                                  <option value='2'>Aurélien Duburque</option>
                                  <option value='3'>Ashley Lila</option>
                                  <option value='4'>Didier Yugi</option>
                                  <option value='5'>Victoria Barcelona</option>
                                </Select>
                                <InputGroupAddon className='plain'>
                                  <Button bsStyle='success'>
                                    <Icon glyph="icon-fontello-plus-1" />
                                  </Button>
                                </InputGroupAddon>
                              </InputGroup>
                          </FormGroup>
                          <Table striped>
                            <thead>
                              <tr>
                                <th>Firstname</th>
                                <th>Lastname</th>
                                <th>Email</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Eric</td>
                                <td>Reptile</td>
                                <td>eric.reptile@gmail.com</td>
                                <td style={{'text-align': 'center'}}><Button bsStyle='danger'><Icon bundle='fontello' glyph='minus'></Icon></Button></td>
                              </tr>
                              <tr>
                                <td>Hubert</td>
                                <td>Bonnisseur de la batte</td>
                                <td>hubert@aol.com</td>
                                <td style={{'text-align': 'center'}}><Button bsStyle='danger'><Icon bundle='fontello' glyph='minus'></Icon></Button></td>
                              </tr>
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    </Grid>
                  </PanelBody>
                </Panel>
              </PanelContainer>
            </Col>
          </Row>
        </Grid>
      </Container>
    );
  },
  componentDidMount: function() {
    var user = auth.getUser();
    this.getFlux().actions.loadClasses(user.email);
  },

  handleSuggestedWordChange: function(e) {
    this.setState({newClasse: e.target.value});
  },

  handleSubmitForm: function(e) {
    e.preventDefault();
    if (this.state.newClasse.trim()) {
      this.getFlux().actions.addClasse(this.state.newClasse);
      this.setState({newClasse: {}});
    }
  }
});

var Page = React.createClass({
  mixins: [Authentication, FluxMixin, SidebarMixin],
  render: function() {
    var classes = React.addons.classSet({
      'container-open': this.state.open
    });
    return (
      <Container id='container' className={classes}>
        <Sidebar activeIs="class"/>
        <Header />
        <Body />
        <Footer />
      </Container>
    );
  }
});

module.exports = Page;

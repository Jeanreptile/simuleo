var Header = require('../../common/header.jsx');
var Sidebar = require('../../common/sidebar.jsx');
var Footer = require('../../common/footer.jsx');

var Fluxxor = require('../../../../../node_modules/fluxxor');
var Authentication = require('../../mixins/authentication');


window.React = React;

var constants = {
  LOAD_SIMUL: "LOAD_SIMUL",
  LOAD_CLASSES_SUCCESS: "LOAD_CLASSES_SUCCESS",
  LOAD_CLASSES_FAIL: "LOAD_CLASSES_FAIL",

  ADD_BUZZ: "ADD_BUZZ",
  ADD_BUZZ_SUCCESS: "ADD_BUZZ_SUCCESS",
  ADD_BUZZ_FAIL: "ADD_BUZZ_FAIL"
};

var actions = {
  loadSimul: function() {
    this.dispatch(constants.LOAD_SIMUL);
  }
};

var SimulStore = Fluxxor.createStore({
  initialize: function() {
    this.loading = false;
    this.error = null;
    this.classes = {};
    //this.socket = io.connect('http://localhost');

    this.bindActions(
      constants.LOAD_SIMUL, this.onLoadSimul,
      constants.LOAD_CLASSES_SUCCESS, this.onLoadSimulationsSuccess,
      constants.LOAD_CLASSES_FAIL, this.onLoadSimulationsFail
    );
  },

  onLoadSimul: function() {
    console.log("url is :" + window.location.href.split("/").pop());
    /*
     this.socket.on('news', function (data) {
       console.log(data);
       socket.emit('my other event', { my: 'data' });
     });
     */
  },

  onLoadSimulationsSuccess: function(payload) {
    this.loading = false;
    this.error = null;

    this.classes = payload.classes.reduce(function(acc, classe) {
      var clientId = _.uniqueId();
      acc[clientId] = {id: clientId, classe: classe, status: "OK"};
      return acc;
    }, {});
    this.emit("change");
  },

  onLoadSimulationsFail: function(payload) {
    this.loading = false;
    this.error = payload.error;
    this.emit("change");
  }
});

var stores = {
  SimulStore: new SimulStore()
  };

var flux = new Fluxxor.Flux(stores, actions);

window.flux = flux;

flux.on("dispatch", function(type, payload) {
  if (console && console.log) {
    console.log("[Dispatch]", type, payload);
  }
});

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;


//React components

var ActionPanel = React.createClass({
  render: function() {
    return (
      <PanelContainer controlStyles='bg-green fg-white'>
        <Panel>
          <PanelHeader className='bg-green'>
            <Grid>
              <Row>
                <Col xs={12} className='fg-white'>
                  <h4>Actions taken</h4>
                </Col>
              </Row>
            </Grid>
          </PanelHeader>
          <PanelBody>
            <Grid>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Action</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.actions.map(function(action) {
                    return(
                      <tr>
                        <td>{action.name}</td>
                        <td>{action.role}</td>
                        <td>{action.action}</td>
                        <td>{action.value}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
});

var Body = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("SimulStore")],
  getInitialState: function() {
    return { newSimulation: {} };
  },

  getStateFromFlux: function() {
    var store = this.getFlux().store("SimulStore");
    return {
      loading: store.loading,
      error: store.error,
      classes: _.values(store.classes)
    };
  },

  componentDidMount: function() {
    var links = document.getElementsByClassName('gallery-1');
    $('.gallery-1').unbind('click').bind('click', function(event) {
      blueimp.Gallery(links, {
        index: $(this).get(0),
        event: event
      });
    });
   //this.getFlux().actions.loadSimul();
  },

  render: function() {
    var roundActions = [
      {
        name:"Florian",
        role:"Buyer",
        action:"Buy a car",
        value:"5000"
      },
      {
        name:"Jean",
        role:"Seller",
        action:"Sell a car",
        value:"5000"
      }
    ];
    return (
      <Container id='body'>
        <Grid>
          <h1 className="text-center">Negociations - 23/10/2015 - Team 1 - Round 2 of 2</h1>
          <Row style={{marginTop: 20}}>
            <Label control sm={3} htmlFor='textareahorizontal'>Message to the team</Label>
          </Row>
          <Row style={{marginBottom: 10}}>
            <Col sm={6}>
              <Textarea id='textareahorizontal' rows='3' placeholder='Write a message to the team...' />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <PanelContainer controlStyles='bg-green fg-white'>
                <PanelHeader className='bg-green fg-white'>
                  <Grid>
                    <Row>
                      <Col xs={12}>
                        <h3>Summary of rounds</h3>
                      </Col>
                    </Row>
                  </Grid>
                </PanelHeader>
                <PanelBody style={{margin: 12.5, marginTop: 0}}>
                  <Accordian>
                    <AccordianPane>
                      <AccordianTitle>Round 1</AccordianTitle>
                      <AccordianContent style={{height: "auto"}} >
                        <h4>Actions taken - Team 1</h4>
                        <Table>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Role</th>
                              <th>Action</th>
                              <th>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {roundActions.map(function(action) {
                              return(
                                <tr>
                                  <td>{action.name}</td>
                                  <td>{action.role}</td>
                                  <td>{action.action}</td>
                                  <td>{action.value}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </Table>
                      </AccordianContent>
                    </AccordianPane>
                    <AccordianPane>
                      <AccordianTitle>Round 2</AccordianTitle>
                      <AccordianContent style={{height: "auto"}} >
                        <h4>Actions taken - Team 1</h4>
                        <Table>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Role</th>
                              <th>Action</th>
                              <th>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {roundActions.map(function(action) {
                              return(
                                <tr>
                                  <td>{action.name}</td>
                                  <td>{action.role}</td>
                                  <td>{action.action}</td>
                                  <td>{action.value}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </Table>
                      </AccordianContent>
                    </AccordianPane>
                  </Accordian>
                </PanelBody>
              </PanelContainer>
            </Col>
          </Row>
          <Row style={{textAlign:"center"}}>
            <Button style={{marginBottom: 5, marginRight: 5}} bsStyle='danger'>Invalidate</Button>{' '}
            <Button style={{marginBottom: 5}} bsStyle='success'>Validate</Button>{' '}
          </Row>
        </Grid>
      </Container>
    );
  },

  handleSuggestedWordChange: function(e) {
    this.setState({newSimulation: e.target.value});
  },

  handleSubmitForm: function(e) {
    e.preventDefault();
    if (this.state.newSimulation.trim()) {
      this.getFlux().actions.addSimulation(this.state.newSimulation);
      this.setState({newSimulation: {}});
    }
  }
});

var Page = React.createClass({
  mixins: [Authentication, SidebarMixin],
  render: function() {
    var classes = React.addons.classSet({
      'container-open': this.state.open
    });
    return (
      <Container id='container' className={classes}>
        <Sidebar activeIs="simul" />
        <Header />
        <Body flux={flux}/>
        <Footer />
      </Container>
    );
  }
});

module.exports = Page;

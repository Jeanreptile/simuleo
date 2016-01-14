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

var TeamPanel = React.createClass({
  render: function() {
    return (
      <PanelContainer controlStyles='bg-blue fg-white'>
        <Panel>
          <PanelHeader className='bg-blue'>
            <Grid>
              <Row>
                <Col xs={12} className='fg-white'>
                  <h4>{this.props.title}</h4>
                </Col>
              </Row>
            </Grid>
          </PanelHeader>
          <PanelBody>
            <Grid>
              <Row>
                <Col xs={12}>
                  <h4>Context message</h4>
                </Col>
              </Row>
              <Row style={{marginBottom:20}}>
                <Col xs={12}>
                  <Textarea disabled rows='3' type="text">{this.props.context}</Textarea>
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
});

var ActionPanel = React.createClass({
  render: function() {
    return (
      <PanelContainer controlStyles='bg-green fg-white'>
        <Panel>
          <PanelHeader className='bg-green'>
            <Grid>
              <Row>
                <Col xs={12} className='fg-white'>
                  <h4>{this.props.name} - {this.props.role}</h4>
                </Col>
              </Row>
            </Grid>
          </PanelHeader>
          <PanelBody>
            <Grid>
              <p><i>{this.props.context}</i></p>
              <h4>Actions available</h4>
              {this.props.actions.map(function(action) {
                  return(
                    <Row style={{marginBottom: 8}}>
                      <Col xs={6}>
                        <Radio value={action.name} name='radio-options'>
                          {action.name}
                        </Radio>
                      </Col>
                      <Col xs={6}>
                        <Input autoFocus type='text' />
                      </Col>
                    </Row>
                  )
                })}
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
});

var ResourcePanel = React.createClass({
  render: function() {
    return (
      <PanelContainer controlStyles='bg-green fg-white'>
        <Panel>
          <PanelHeader className='bg-green'>
            <Grid>
              <Row>
                <Col xs={12} className='fg-white'>
                  <h4>Resources</h4>
                </Col>
              </Row>
            </Grid>
          </PanelHeader>
          <PanelBody>
            <Grid>
              <h4>Shared</h4>
              <p>None</p>
              <h4>Individual</h4>
              <Table>
                <tbody>
                  {this.props.resources.map(function(resource) {
                    return(
                      <tr>
                        <td>{resource.name}</td>
                        <td>{resource.value}</td>
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
    var resources = [
      {
        name:"Buying offer",
        value:0
      },
      {
        name:"Bank account",
        value:8000
      }
    ];
    var actions = [
      {
        name:"Buy a car"
      }
    ];
    return (
      <Container id='body'>
        <Grid>
          <Row xs={12} style={{textAlign:"center", marginBottom:10}}>
            <h1 className="text-center">Negociations - 23/10/2015</h1>
            <h2>Round 1 of 1</h2>
          </Row>
          <Row>
            <Col xs={12} sm={6}>
              <TeamPanel title='Team 1' context='The two of you are in a car dealership'/>
              <ActionPanel name="Florian" role="Buyer" context="Your goal is to buy a car" actions={actions}/>
            </Col>
            <Col xs={12} sm={6}>
              <ResourcePanel resources={resources}/>
            </Col>
          </Row>
          <Row style={{textAlign:"center"}}>
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

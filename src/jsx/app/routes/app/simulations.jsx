var Header = require('../../common/header.jsx');
var Sidebar = require('../../common/sidebar.jsx');
var Footer = require('../../common/footer.jsx');

var Fluxxor = require('../../../../../node_modules/fluxxor');


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

var SimulationItem = React.createClass({
  getInitialState: function() {
    return {
      active: this.props.active || false,
    };
  },
  handleIncrement: function(e) {
    if(this.state.active) return;
    this.setState({
      active: true,
      counts: this.state.counts+1
    });
  },
  render: function() {
    return (
      <PanelContainer>
        <Panel>
          <PanelHeader>
            <Grid className='gallery-item'>
              <Row>
                <Col xs={12} style={{padding: 12.5}}>
                  <a className='gallery-item-link' href={'/simul_negociation/config'} title={this.props.title}>
                    <Img responsive src={'/imgs/gallery/'+this.props.image+'.jpg'} alt={this.props.title} width='200' height='150'/>
                    <div className='black-wrapper text-center'>
                      <Table style={{height: '100%', width: '100%'}}>
                        <tbody>
                          <tr>
                            <td>
                              <Icon glyph='icon-stroke-gap-icons-Goto icon-3x' />
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </a>
                  <div className='text-center'>
                    <h4 className='fg-darkgrayishblue75 hidden-xs' style={{textTransform: 'uppercase'}}>{this.props.title}</h4>
                    <h6 className='fg-darkgrayishblue75 visible-xs' style={{textTransform: 'uppercase'}}>{this.props.title}</h6>
                  </div>
                </Col>
              </Row>
            </Grid>
          </PanelHeader>
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
    return (
      <Container id='body'>
        <Grid>
        <h1>Simulations</h1>
          <Row className='gallery-view'>
            <Col xs={6} sm={4} collapseRight>
              <SimulationItem image='negociation' title='negociation' subtitle='10th Dec - 12th Dec' />
            </Col>
          </Row>
        </Grid>
        {this.props.children}
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

var Simulation = React.createClass({
  render: function() {
    var statusText, statusStyle = {};
    switch(this.props.classe.status) {
    case "OK":
      statusText = "";
      break;
    case "ADDING":
      statusText = "adding...";
      statusStyle = { color: "#ccc" };
      break;
    case "ERROR":
      statusText = "error: " + this.props.word.error;
      statusStyle = { color: "red" };
      break;
    }
    return (
      <div>
        <PanelContainer>
          <Panel>
            <PanelBody>
              <Grid>
                <Row>
                  <Col xs={12}>
                    <h4 style={{marginTop: 0}}>{this.props.classe.classe.class_name}</h4>
                    <Table striped>
                      <thead>
                        <tr>
                          <th>Nom</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.props.classe.classe.students.map(function(student) {
                          return(
                            <tr>
                              <td>{student.name}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Grid>
            </PanelBody>
          </Panel>
        </PanelContainer>
      </div>
    );
  }
});

var Page = React.createClass({
  mixins: [SidebarMixin],
  render: function() {
    var classes = React.addons.classSet({
      'container-open': this.state.open
    });
    return (
      <Container id='container' className={classes}>
        <Sidebar />
        <Header />
        <Body flux={flux}/>
        <Footer />
      </Container>
    );
  }
});

module.exports = Page;

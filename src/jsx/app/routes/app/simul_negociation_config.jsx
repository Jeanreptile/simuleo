var Header = require('../../common/header.jsx');
var Sidebar = require('../../common/sidebar.jsx');
var Footer = require('../../common/footer.jsx');

var Fluxxor = require('../../../../../node_modules/fluxxor');
var ReactStyle = require('../../react-styles/src/ReactStyle.jsx');

window.React = React;

var constants = {
  ADD_SIMUL: "ADD_SIMUL",
  ADD_SIMUL_SUCCESS: "ADD_SIMUL_SUCCESS",
  ADD_SIMUL_FAIL: "ADD_SIMUL_FAIL"
};

var actions = {
  addSimul: function(contexte, vendeur, acheteur) {
    this.dispatch(constants.ADD_SIMUL);

    $.post( "/api/simul_negociation", {acheteur: acheteur, vendeur: vendeur, contexte: contexte}, function(links) {
      }.bind(this))
      .done(function(links) {
        this.dispatch(constants.ADD_SIMUL_SUCCESS, {uniqueId: links.uniqueId, acheteur : acheteur, vendeur: vendeur, contexte: contexte});
      }.bind(this))
      .fail(function(error) {
         this.dispatch(constants.ADD_SIMUL_FAIL, {error: error});
      }.bind(this));
  }
};

var SimulStore = Fluxxor.createStore({
  initialize: function() {
    this.loading = false;
    this.finished = false;
    this.info = {};
    //this.socket = io.connect('http://localhost');

    this.bindActions(
      constants.ADD_SIMUL, this.onAddSimul,
      constants.ADD_SIMUL_SUCCESS, this.onAddSimulSuccess,
      constants.ADD_SIMUL_FAIL, this.onAddSimulFail
    );
  },

  onAddSimul: function(payload) {
    //var word = {id: payload.id, word: payload.word, status: "ADDING"};
    //this.words[payload.id] = word;
    //APICALL
    //this.emit("change");
    this.finished = true;
    this.emit("change");
  },

  onAddSimulSuccess: function(payload) {
    //this.
    this.info["acheteur"] = "http://localhost:8080/simul_negociation/" + payload.uniqueId + "/acheteur";
    this.info["vendeur"] = "http://localhost:8080/simul_negociation/" + payload.uniqueId + "/vendeur";;
    this.info["montant_acheteur"] = payload.acheteur;
    this.info["contexte"] = payload.contexte;
    this.info["montant_vendeur"] = payload.vendeur;
    this.emit("change");
  },

  onAddSimulFail: function(payload) {
    this.words[payload.id].status = "ERROR";
    this.words[payload.id].error = payload.error;
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

var Body = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("SimulStore")],
  getInitialState: function() {
    return { newClasse: "" };
  },

  getStateFromFlux: function() {
    var store = this.getFlux().store("SimulStore");
    return {
      loading: store.loading,
      finished: store.finished,
      info: store.info
    };
  },

  render: function() {
    return (
      <Container id='body'>
       {this.state.loading ? <p>Loading...</p> : null}
       <Grid>
          <Row>
            <Col xs={12}>
                {this.state.finished ? <Recap info={this.state.info}/> : <FormSimul />}
            </Col>
          </Row>
        </Grid>
        {ReactStyle.renderToComponents()}
      </Container>
    );
  }
});


var FormSimul = React.createClass({
  mixins: [FluxMixin],

  getInitialState: function() {
   return { montant_acheteur: "", montant_vendeur: "", contexte:"" };
 },

  createStep: function(e) {
    e.preventDefault();
    e.stopPropagation();
    var data = $(e.target).serializeObject();
    if(!data.title.length) {
      alert('Title required!');
      return;
    }
    if(!data.content.length) {
      alert('Content required');
      return;
    }
    $('#create-step').find('input:visible').eq(0).focus();
  },
  insertStep: function(e) {
    e.preventDefault();
    e.stopPropagation();
    var data = $(e.target).serializeObject();
    if(!data.position.length) {
      alert('Position required!');
      return;
    }
    if(!data.title.length) {
      alert('Title required!');
      return;
    }
    if(!data.content.length) {
      alert('Content required');
      return;
    }
    $('#insert-step').find('input:visible').eq(0).focus();
  },
  removeStep: function(e) {
    e.preventDefault();
    e.stopPropagation();
    var data = $(e.target).serializeObject();
    if(!data.position.length) {
      alert('Position required!');
      return;
    }
    $('#remove-step').find('input:visible').eq(0).focus();
  },
  componentDidMount: function() {
    var isLtr = $('html').attr('dir') === 'ltr';
    var styles = {};

    if(isLtr) {
      styles['#wizard-2 .form-border'] = {
        borderRight: '1px solid #ddd'
      };
    } else {
      styles['#wizard-2 .form-border'] = {
        borderLeft: '1px solid #ddd'
      };
    }

    ReactStyle.addRules(ReactStyle.create(styles));

    $('#wizard-1').steps({
      autoFocus: true
    });

    $("#form-2").validate({
      rules: {
        confirm_password: {
          equalTo: "#password"
        }
      }
    });

    $('#wizard-2').steps({
      onStepChanging: function (event, currentIndex, newIndex) {
        $('#form-2').validate().settings.ignore = ':disabled,:hidden';
        return $('#form-2').valid();
      },
      onFinishing: function (event, currentIndex) {
        $('#form-2').validate().settings.ignore = ':disabled';
        return $('#form-2').valid();
      },
      onFinished: function (event, currentIndex) {
        this.getFlux().actions.addSimul(this.state.contexte, this.state.montant_vendeur, this.state.montant_acheteur);
      }.bind(this)
    });


    $('#create-step').bind('submit', this.createStep);
    $('#insert-step').bind('submit', this.insertStep);
    $('#remove-step').bind('submit', this.removeStep);
  },

  componentWillUnmount: function() {
    $('#create-step').unbind('submit', this.createStep);
    $('#insert-step').unbind('submit', this.insertStep);
    $('#remove-step').unbind('submit', this.removeStep);
  },
  render: function() {
    return (
              <PanelContainer noOverflow controlStyles='bg-pink fg-white'>
                <Panel>
                  <PanelHeader className='bg-pink fg-white' style={{margin: 0}}>
                    <Grid>
                      <Row>
                        <Col xs={12}>
                          <h2>Simulation negociation – configuration</h2>
                        </Col>
                      </Row>
                    </Grid>
                  </PanelHeader>
                  <PanelBody>
                    <Form id='form-2'>
                      <div id='wizard-2'>
                        <h1>Informations</h1>
                        <div>
                          <Grid>
                            <Row>
                              <Col sm={4} xs={12} collapseLeft xsOnlyCollapseRight>
                                <FormGroup>
                                  <Label htmlFor='contexte'>Contexte</Label>
                                  <Textarea rows='4' id='contexte' name='contexte' className='required'
                                    value={this.state.contexte}
                                    onChange={this.handleChangeInfo}/>
                                </FormGroup>
                              </Col>
                              <Col sm={4} xs={6} collapseLeft className='form-border'>
                                <FormGroup>
                                  <Label htmlFor='montant_acheteur'>Montant maximal de l'acheteur</Label>
                                  <Input type='text' id='montant_acheteur' name='montant_acheteur' className='required'
                                    value={this.state.montant_acheteur}
                                    onChange={this.handleChangeInfo}/>
                                </FormGroup>
                                <FormGroup>
                                  <Label htmlFor='montant_vendeur'>Montant minimal du vendeur</Label>
                                  <Input type='text' id='montant_vendeur' name='montant_vendeur' className='required'
                                    value={this.state.montant_vendeur}
                                    onChange={this.handleChangeInfo}/>
                                </FormGroup>
                              </Col>
                              <Col sm={4} xs={6} collapseRight>
                                <p>
                                  Rentrer les informations.
                                </p>
                              </Col>
                            </Row>
                          </Grid>
                        </div>
                      </div>
                    </Form>
                  </PanelBody>
                </Panel>
              </PanelContainer>
    );
  },
  handleChangeInfo: function(e) {
    if(e.target.name == 'montant_acheteur')
      this.setState({montant_acheteur: e.target.value});
    if(e.target.name == 'montant_vendeur')
      this.setState({montant_vendeur: e.target.value});
    if(e.target.name == 'contexte')
      this.setState({contexte: e.target.value});
  },
});


var Recap = React.createClass({
  mixins: [FluxMixin],
  render: function() {
    /*
    var statusText, statusStyle = {};
    switch(this.props.classe.info) {
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
    */
    return (
      <div>
            <Col sm={6}>
              <PanelContainer controlStyles='bg-green fg-white'>
                <Panel>
                  <PanelHeader className='bg-green'>
                    <Grid>
                      <Row>
                        <Col xs={12} className='fg-white'>
                          <h2>Récapitulatif</h2>
                        </Col>
                      </Row>
                    </Grid>
                  </PanelHeader>
                  <PanelBody>
                    <Grid>
                      <Row>
                        <Col xs={12}>
                          <ul>
                            <li>
                              Contexte : {this.props.info["contexte"]}
                            </li>
                            <li>
                              Montant acheteur: {this.props.info["montant_acheteur"]}
                            </li>
                            <li>
                              Montant vendeur: {this.props.info["montant_vendeur"]}
                            </li>
                            <li>
                              Lien acheteur: {this.props.info["acheteur"]}
                            </li>
                            <li>
                              Lien vendeur: {this.props.info["vendeur"]}
                            </li>
                          </ul>
                        </Col>
                      </Row>
                    </Grid>
                  </PanelBody>
                </Panel>
              </PanelContainer>
            </Col>
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

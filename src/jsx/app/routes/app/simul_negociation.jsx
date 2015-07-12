var Header = require('../../common/header.jsx');
var Sidebar = require('../../common/sidebar.jsx');
var Footer = require('../../common/footer.jsx');

var Fluxxor = require('../../../../../node_modules/fluxxor');


window.React = React;

var constants = {
  LOAD_SIMUL: "LOAD_SIMUL",
  LOAD_SIMUL_SUCCESS: "LOAD_SIMUL_SUCCESS",
  LOAD_SIMUL_FAIL: "LOAD_SIMUL_FAIL",

  ADD_PROPOSITION: "ADD_PROPOSITION",
  ADD_PROPOSITION_SUCCESS: "ADD_PROPOSITION_SUCCESS",
  ADD_PROPOSITION_FAIL: "ADD_PROPOSITION_FAIL"
};

var actions = {
  loadSimul: function(type, uniqueId) {
    this.dispatch(constants.LOAD_SIMUL, {type, uniqueId});
    $.get( "/api/simul_negociation/" + uniqueId, function(infos) {
        this.dispatch(constants.LOAD_SIMUL_SUCCESS, {infos: infos[0], type: this.type});
      }.bind(this))
      .done(function() {
      })
      .fail(function(error) {
         this.dispatch(constants.LOAD_SIMUL_FAIL, {error: error});
      }.bind(this));
  }
};

var SimulStore = Fluxxor.createStore({
  initialize: function() {
    this.loading = true;
    this.typeRole = "";
    this.montant_acheteur = "";
    this.montant_vendeur = "";
    this.proposition_acheteur = "";
    this.uniqueId = "";
    //this.socket = io.connect('http://localhost');

    this.bindActions(
      constants.LOAD_SIMUL, this.onLoadSimul,
      constants.LOAD_SIMUL_SUCCESS, this.onLoadSimulSuccess,
      constants.LOAD_SIMUL_FAIL, this.onLoadSimulFail
    );
  },

  onLoadSimul: function(payload) {
    this.typeRole = payload.type;
    this.uniqueId = payload.uniqueId;
    this.loading = false;
    this.emit("change");
    /*
     this.socket.on('news', function (data) {
       console.log(data);
       socket.emit('my other event', { my: 'data' });
     });
     */
  },

  onLoadSimulSuccess: function(payload) {
    this.loading = false;
    this.error = null;
    this.contexte = payload.infos.contexte;
    console.log(JSON.stringify(payload.infos));
    if (this.typeRole == "acheteur")
    {
      this.montant_acheteur = payload.infos.acheteur;
    }
    else {
      this.montant_vendeur = payload.infos.vendeur;
    }
    this.emit("change");

/*
    this.classes = payload.classes.reduce(function(acc, classe) {
      var clientId = _.uniqueId();
      acc[clientId] = {id: clientId, classe: classe, status: "OK"};
      return acc;
    }, {});
    this.emit("change");
    */
  },

  onLoadSimulFail: function(payload) {
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

var Body = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("SimulStore")],
  getInitialState: function() {
    return { newClasse: {} };
  },

  getStateFromFlux: function() {
    var store = this.getFlux().store("SimulStore");
    return {
      loading: store.loading,
      error: store.error,
      montant_acheteur: store.montant_acheteur,
      montant_vendeur: store.montant_vendeur,
      proposition_acheteur: store.proposition_acheteur,
      typeRole: store.typeRole,
      contexte: store.contexte,
      uniqueId: store.uniqueId
    };
  },

  render: function() {
    return (
      <Container id='body'>
       {this.state.error ? "Error loading data" : null}
       <Grid>
         <Col sm={8}>
         {this.state.typeRole == 'acheteur'  ? <Acheteur contexte={this.state.contexte} montant={this.state.montant_acheteur} uniqueId={this.state.uniqueId} /> : <Vendeur  contexte={this.state.contexte} montant={this.state.montant_vendeur}  proposition_acheteur={this.state.proposition_acheteur} />}
         {this.state.loading ? <p>Loading...</p> : null}
        </Col>
        </Grid>
      </Container>
    );
  },


  loadProposition: function()
  {
    $.ajax({
      url: "/api/simul_negociation/" + this.state.uniqueId,
      dataType: 'json',
      cache: false,
      success: function(data) {
        if (data[0].proposition_acheteur != undefined)
        {
          this.setState({proposition_acheteur: data[0].proposition_acheteur});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    var type = window.location.href.split("/").pop();
    var uniqueId = window.location.href.split("/").splice(-2, 1);
    this.getFlux().actions.loadSimul(type, uniqueId);
    setInterval(this.loadProposition, 2000);

    /*
    var socket = io.connect('http://localhost:3000');
     socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});*/
   //this.getFlux().actions.loadSimul();
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

var Acheteur = React.createClass({
  mixins: [FluxMixin],
  getInitialState: function() {
   return { proposition_acheteur: ""};
 },
  render: function() {
    var statusText, statusStyle = {};
    /*
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
    */
    return (
      <div>
      <PanelContainer noOverflow controlStyles='bg-purple fg-white'>
        <PanelHeader className='bg-purple fg-white'>
          <Grid>
            <Row>
              <Col xs={12}>
                <h3>Simulation negociation – Acheteur</h3>
                <h5>Contexte : {this.props.contexte}</h5>
                <p>Vous devez acheter à {this.props.montant} € maximum.</p>
              </Col>
            </Row>
          </Grid>
        </PanelHeader>
        <PanelBody>
          <Grid>
            <Row>
              <Col xs={12}>
                <Form horizontal>
                  <FormGroup>
                    <Label htmlFor='largeinput' sm={3} control>Proposition (en €) </Label>
                    <Col sm={9}>
                      <Input id='proposition_acheteur' placeholder='Indiquez votre prix' lg
                                    value={this.state.proposition_acheteur}
                                    onChange={this.handleChangeInfo}/>
                    </Col>
                  </FormGroup>
                </Form>
              </Col>
            </Row>
          </Grid>
        </PanelBody>
        <PanelFooter className='bg-purple text-right'>
          <Grid>
            <Row>
              <Col xs={12}>
                <br/>
                <div>
                  <Button outlined bsStyle='lightpurple' onClick={this.handleSubmitForm}>Proposer</Button>
                </div>
                <br/>
              </Col>
            </Row>
          </Grid>
        </PanelFooter>
      </PanelContainer>
      </div>
    );
  },

  handleSubmitForm: function(e) {
    $.post( "/api/simul_negociation/" + this.props.uniqueId, {prix_acheteur: this.state.proposition_acheteur}, function(links) {
      }.bind(this))
      .done(function(links) {
        console.log("Ok !" + JSON.stringify(links));
      }.bind(this))
      .fail(function(error) {
      }.bind(this));
  },

  handleChangeInfo: function(e) {
    this.setState({proposition_acheteur: e.target.value});
  }
});


var Vendeur = React.createClass({
  mixins: [FluxMixin],
  render: function() {
    var statusText, statusStyle = {};
    /*
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
    */
    return (
      <div>
      <PanelContainer noOverflow controlStyles='bg-green fg-white'>
        <PanelHeader className='bg-green fg-white'>
          <Grid>
            <Row>
              <Col xs={12}>
                <h3>Simulation negociation – Vendeur</h3>
                <h5>Contexte : {this.props.contexte}</h5>
                <p>Vous devez vendre à {this.props.montant} € minimum.</p>
              </Col>
            </Row>
          </Grid>
        </PanelHeader>
        <PanelBody>
          <Grid>
            <Row>
              <Col xs={12}>
                { this.props.proposition_acheteur == "" ?
                <p>Votre acheteur n'a rien proposé pour l'instant.</p>
                :
                  <p>Votre acheteur a proposé {this.props.proposition_acheteur} €</p>
                }
              </Col>
            </Row>
          </Grid>
        </PanelBody>
        <PanelFooter className='bg-green text-right'>
          <Grid>
            <Row>
              <Col xs={12}>
                <br/>
                <div>
                  <Button outlined bsStyle='lightgreen'>Refuser</Button>{' '}
                  <Button outlined bsStyle='lightgreen'>Accepter</Button>
                </div>
                <br/>
              </Col>
            </Row>
          </Grid>
        </PanelFooter>
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

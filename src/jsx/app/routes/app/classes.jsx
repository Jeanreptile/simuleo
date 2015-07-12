var Header = require('../../common/header.jsx');
var Sidebar = require('../../common/sidebar.jsx');
var Footer = require('../../common/footer.jsx');

var Fluxxor = require('../../../../../node_modules/fluxxor');


window.React = React;

var constants = {
  LOAD_CLASSES: "LOAD_CLASSES",
  LOAD_CLASSES_SUCCESS: "LOAD_CLASSES_SUCCESS",
  LOAD_CLASSES_FAIL: "LOAD_CLASSES_FAIL",

  ADD_BUZZ: "ADD_BUZZ",
  ADD_BUZZ_SUCCESS: "ADD_BUZZ_SUCCESS",
  ADD_BUZZ_FAIL: "ADD_BUZZ_FAIL"
};

var actions = {
  loadClasses: function() {
    this.dispatch(constants.LOAD_CLASSES);

    $.get( "/classess", function(classes) {
        this.dispatch(constants.LOAD_CLASSES_SUCCESS, {classes: classes});
      }.bind(this))
      .done(function() {
      })
      .fail(function() {
         this.dispatch(constants.LOAD_CLASSES_FAIL, {error: error});
      }.bind(this));
  },

  addClasse: function(word) {
    var id = _.uniqueId();
    this.dispatch(constants.ADD_BUZZ, {id: id, word: word});

    BuzzwordClient.submit(word, function() {
      this.dispatch(constants.ADD_BUZZ_SUCCESS, {id: id});
    }.bind(this), function(error) {
      this.dispatch(constants.ADD_BUZZ_FAIL, {id: id, error: error});
    }.bind(this));
  }
};

var ClasseStore = Fluxxor.createStore({
  initialize: function() {
    this.loading = false;
    this.error = null;
    this.classes = {};

    this.bindActions(
      constants.LOAD_CLASSES, this.onLoadClasses,
      constants.LOAD_CLASSES_SUCCESS, this.onLoadClassesSuccess,
      constants.LOAD_CLASSES_FAIL, this.onLoadClassesFail,

      constants.ADD_BUZZ, this.onAddBuzz,
      constants.ADD_BUZZ_SUCCESS, this.onAddBuzzSuccess,
      constants.ADD_BUZZ_FAIL, this.onAddBuzzFail
    );
  },

  onLoadClasses: function() {
    this.loading = true;
    this.emit("change");
  },

  onLoadClassesSuccess: function(payload) {
    this.loading = false;
    this.error = null;

    this.classes = payload.classes.reduce(function(acc, classe) {
      var clientId = _.uniqueId();
      acc[clientId] = {id: clientId, classe: classe, status: "OK"};
      return acc;
    }, {});
    this.emit("change");
  },

  onLoadClassesFail: function(payload) {
    this.loading = false;
    this.error = payload.error;
    this.emit("change");
  },

  onAddBuzz: function(payload) {
    var word = {id: payload.id, word: payload.word, status: "ADDING"};
    this.words[payload.id] = word;
    this.emit("change");
  },

  onAddBuzzSuccess: function(payload) {
    this.words[payload.id].status = "OK";
    this.emit("change");
  },

  onAddBuzzFail: function(payload) {
    this.words[payload.id].status = "ERROR";
    this.words[payload.id].error = payload.error;
    this.emit("change");
  }
});

var stores = {
  ClasseStore: new ClasseStore()
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
       {this.state.error ? "Error loading data" : null}
       {this.state.loading ? <p>Loading...</p> : null}
       <Grid>
         <h1>Classes</h1>
        {this.state.classes.map(function(classe, i ) {
          console.log("React Console : " + classe.classe.class_name + "||" + i );
          if ((i + 0) % 4 == 0)
          {
            return(
              <Col sm={6}>
                <Classe key={classe.id} classe={classe} />
              </Col>
            )
          }
          else{
            return(
            <Col sm={6}>
             <Classe key={classe.id} classe={classe} />
            </Col>
            )
          }
        })}
        </Grid>
      </Container>
    );
  },
  componentDidMount: function() {
    this.getFlux().actions.loadClasses();
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

var Classe = React.createClass({
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

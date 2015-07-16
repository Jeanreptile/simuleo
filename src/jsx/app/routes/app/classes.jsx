var Header = require('../../common/header.jsx');
var Sidebar = require('../../common/sidebar.jsx');
var Footer = require('../../common/footer.jsx');

var Fluxxor = require('../../../../../node_modules/fluxxor');
var AuthenticatedMixin = require('../../mixins/authenticatedMixin');


window.React = React;


var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Body = React.createClass({
  mixins: [AuthenticatedMixin, FluxMixin, StoreWatchMixin("ClasseStore")],
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
         <p>HEHO {this.props.user}</p>
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
             <Classe {...this.props} key={classe.id} classe={classe} />
            </Col>
            )
          }
        }.bind(this))}
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
                    <h4 style={{marginTop: 0}}>{this.props.classe.classe.class_name} </h4>
                    <p>TESTTT {this.props.user}</p>
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
  mixins: [AuthenticatedMixin, FluxMixin, SidebarMixin],
  render: function() {
    var classes = React.addons.classSet({
      'container-open': this.state.open
    });
    return (
      <Container id='container' className={classes}>
        <Sidebar />
        <Header />
        <Body />
        <Footer />
      </Container>
    );
  }
});

module.exports = Page;

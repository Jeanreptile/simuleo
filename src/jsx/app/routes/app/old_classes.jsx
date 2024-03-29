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
       {this.state.error ? "Error loading data" : null}
       {this.state.loading ? <p>Loading...</p> : null}
       <Grid>
         <h1>Classes</h1>
        {this.state.classes.map(function(classe, i ) {
          console.log("React Console : " + classe.classe.class_name + "||" + i );
          if ((i + 0) % 4 == 0)
            {
            return(
              <Col sm={6} key={classe.id}>
                <Classe classe={classe} />
              </Col>
            )
          }
          else{
            return(
            <Col sm={6} key={classe.id}>
             <Classe {...this.props} classe={classe} />
            </Col>
            )
          }
        }.bind(this))}
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
                    <Table striped>
                      <thead>
                        <tr>
                          <th>Prénom</th>
                          <th>Nom</th>
                          <th>Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.props.classe.classe.students.map(function(student) {
                          return(
                            <tr key = {student.id}>
                              <td>{student.first_name}</td>
                              <td>{student.last_name}</td>
                              <td>{student.email}</td>
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
  mixins: [Authentication, FluxMixin, SidebarMixin],
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

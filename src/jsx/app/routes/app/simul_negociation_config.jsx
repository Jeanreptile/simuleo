var Header = require('../../common/header.jsx');
var Sidebar = require('../../common/sidebar.jsx');
var Footer = require('../../common/footer.jsx');

var Fluxxor = require('../../../../../node_modules/fluxxor');
var ReactStyle = require('../../react-styles/src/ReactStyle.jsx');

var Authentication = require('../../mixins/authentication');
var auth = require('../../services/auth');

window.React = React;

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;


    var SetIntervalMixin = {
      componentWillMount: function() {
        this.intervals = [];
      },
      setInterval: function() {
        this.intervals.push(setInterval.apply(null, arguments));
      },
      componentWillUnmount: function() {
        this.intervals.map(clearInterval);
      }
    };

var Body = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("SimulConfigStore")],
  getInitialState: function() {
    var user = auth.getUser();
    return { newClasse: "", user: user };
  },

  getStateFromFlux: function() {
    var Simulstore = this.getFlux().store("SimulConfigStore");
    return {
      loading: Simulstore.loading,
      finished: Simulstore.finished,
      info: Simulstore.info
    };
  },

  render: function() {
    return (
      <Container id='body'>
       {this.state.loading ? <p>Loading...</p> : null}
       <Grid>
          <Row>
            <Col xs={12}>
                {this.state.finished ? <Recap info={this.state.info}/> : <FormSimul {...this.state}/>}
            </Col>
          </Row>
        </Grid>
        {ReactStyle.renderToComponents()}
      </Container>
    );
  }
});

var FormSimul = React.createClass({
  mixins: [SetIntervalMixin,FluxMixin,React.addons.LinkedStateMixin, StoreWatchMixin("ClasseStore", "StudentStore")],

  getInitialState: function() {
   return { contexte_vendeur: "", contexte_acheteur: "", groupIds: [], groupsData: []};
 },
  getStateFromFlux: function() {
    var ClasseStore = this.getFlux().store("ClasseStore");
    var StudentStore = this.getFlux().store("StudentStore");
    return {
      classes: _.values(ClasseStore.classes)
    };
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

  componentWillUnmount: function() {
    $('#create-step').unbind('submit', this.createStep);
    $('#insert-step').unbind('submit', this.insertStep);
    $('#remove-step').unbind('submit', this.removeStep);
  },
  handleGroupChanged: function(groupId, type, value){
    var oldGroupsData = this.state.groupsData;
    oldGroupsData.push({groupsId: groupId, type: type, value: value});
    this.setState({groupsData: oldGroupsData});
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
                              <Col sm={6} xs={12} collapseLeft xsOnlyCollapseRight>
                                <FormGroup>
                                  <Label htmlFor='contexte'>Contexte acheteur</Label>
                                  <Textarea rows='15' id='contexte_acheteur' name='contexte_acheteur' className='required'
                                    valueLink={this.linkState('contexte_acheteur')}
                                    onChange={this.handleChangeInfo}/>
                                </FormGroup>
                              </Col>
                              <Col sm={6} xs={12} collapseLeft xsOnlyCollapseRight>
                                <FormGroup>
                                  <Label htmlFor='contexte'>Contexte vendeur</Label>
                                  <Textarea rows='15' id='contexte_acheteur' name='contexte_acheteur' className='required'
                                    valueLink={this.linkState('contexte_vendeur')}
                                    onChange={this.handleChangeInfo}/>
                                </FormGroup>
                              </Col>
                            </Row>
                          </Grid>
                        </div>

                        <h1>Sélection des groupes</h1>
                        <div>
                            <FormGroup>
                              <Label>Sélection des groupes</Label>
                              <div>
                                {this.state.classes.map(function(classe, i ) {
                                return <Radio key={classe.classe.id} inline value={classe.classe.id} name='inline-radio-options' onChange={this.handleClasseAdded.bind(this, classe.classe.students)}>
                                  {classe.classe.class_name}
                                </Radio>
                              }.bind(this))}
                              </div>
                              <hr/>
                            </FormGroup>
                            <Grid>
                              <Row>
                                {this.state.groupIds.map(function(groupId){
                                  return <MyForm key={groupId} groupId={groupId} callbackOnChange={this.handleGroupChanged} />
                                }.bind(this))}
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
  handleClasseAdded: function(e, thisEl) {
    //thisEl.preventDefault();
    this.getFlux().actions.initStudents(e);
    var length = (e.length)/2;
    var ids = [];
    for (i = 1; i < length +1; i++)
    {
      ids.push(i);
    }
    this.setState({groupIds: ids});
  },
  componentDidMount: function() {
    this.getFlux().actions.loadClasses(this.props.user.email);
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
        //this.getFlux().actions.addSimul(this.state.contexte, this.state.montant_vendeur, this.state.montant_acheteur);
        console.log("YO");
        console.log("Alors : " + JSON.stringify(this.state.groupsData));
      }.bind(this)
    });

    $("#dropdownselect45").change(function() {
      console.log("HELLLO ??");
    });


    $('#create-step').bind('submit', this.createStep);
    $('#insert-step').bind('submit', this.insertStep);
    $('#remove-step').bind('submit', this.removeStep);
  }
});


var MyForm = React.createClass({
  mixins: [FluxMixin],
  handleChange: function(type, value) {
    this.props.callbackOnChange(this.props.groupId, type, value);
  },
  render: function() {
    console.log("IN RENDER" + JSON.stringify(this.props));
    return(
        <Col sm={4} smCollapseRight>
                            <PanelContainer controlStyles='bg-blue fg-white'>
                              <Panel>
                                <PanelHeader className='bg-blue'>
                                  <Grid>
                                    <Row>
                                      <Col xs={12} className='fg-white'>
                                        <h3>Groupe {this.props.groupId}</h3>
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
                                              <FormGroup>
                                                <Label htmlFor='acheteur'>Acheteur</Label>
                                                <MySelect {...this.props} type="acheteur" callbackOnChange={this.handleChange}/>
                                              </FormGroup>
                                            </li>
                                            <li>
                                              <FormGroup>
                                                <Label htmlFor='vendeur'>Vendeur</Label>
                                                <MySelect {...this.props} type="vendeur" callbackOnChange={this.handleChange}/>
                                              </FormGroup>
                                            </li>
                                          </ul>
                                      </Col>
                                    </Row>
                                  </Grid>
                                </PanelBody>
                              </Panel>
                            </PanelContainer>
                          </Col>
                        )}
});

var MySelect = React.createClass({
  mixins: [SetIntervalMixin, FluxMixin, StoreWatchMixin("StudentStore")],

  getInitialState: function() {
   return { studentsOptions: [], dropdownId: ""};
 },
  getStateFromFlux: function() {
    var StudentStore = this.getFlux().store("StudentStore");
    return {
      studentsList: StudentStore.students
    };
  },
    change: function(event){
        this.props.callbackOnChange(this.props.type, event.target.value);
    },
    render: function(){
    console.log("IN RENDER" + JSON.stringify(this.props));
       return(
            <Select id={this.state.dropdownId} defaultValue='1' onChange={this.change} value={this.state.value}>
              <option key='1' value='1'>Sélectionner étudiant</option>
              {this.state.studentsOptions}
            </Select>
       );
    },
    updateStudentOptions: function(){

    },
    componentDidMount: function() {
      this.setState({dropdownId: this.props.type + this.props.groupId});
      if (this.state.studentsList){
        this.state.studentsList.map( function(student){
          var full_name = student.first_name + " " + student.last_name;
          var value = student.id;
          this.state.studentsOptions.push(<option key={student.first_name} value={value}>{full_name}</option>)
        }.bind(this))
      }
    }
});


var Recap = React.createClass({
  mixins: [FluxMixin],
  render: function() {
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
                              Montant acheteur: {this.props.info["contexte_acheteur"]}
                            </li>
                            <li>
                              Montant vendeur: {this.props.info["contexte_vendeur"]}
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

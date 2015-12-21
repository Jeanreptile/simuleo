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
  mixins: [SetIntervalMixin,FluxMixin,React.addons.LinkedStateMixin, StoreWatchMixin("ClasseStore")],

  getInitialState: function() {
   return { contexte_vendeur: "", contexte_acheteur: "", groupIds: [], groupsData: [], errors: {}, maxGroups: "", maxRoles:"", count: 0};
 },
  getStateFromFlux: function() {
    var ClasseStore = this.getFlux().store("ClasseStore");
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
    var groupChanged = false;
    oldGroupsData.forEach(function(groupData){
      if (groupData["groupId"] === groupId){
        groupChanged = true;
        var typeChanged = false;
        groupData["roles"].forEach(function(groupData){
          if (groupData["type"] === type) {
            typeChanged = true;
            groupData["value"] = value;
          }
        });
        if (!typeChanged) {
          groupData["roles"].push({type: type, value: value});
          var count = parseInt(this.state.count) + 1;
          this.setState({count: count});
        }
      }
    }.bind(this));
    if (!groupChanged){
      oldGroupsData.push({groupId: groupId, roles: [{type: type, value: value}]});
          var count = parseInt(this.state.count) + 1;
          this.setState({count: count});
    }
    this.setState({groupsData: oldGroupsData});
    this.getFlux().actions.removeStudent(value);
  },
  render: function() {
    return (
              <PanelContainer noOverflow controlStyles='bg-green fg-white'>
                <Panel>
                  <PanelHeader className='bg-green fg-white' style={{margin: 0}}>
                    <Grid>
                      <Row>
                        <Col xs={12}>
                          <h2>Set up simulation</h2>
                        </Col>
                      </Row>
                    </Grid>
                  </PanelHeader>
                  <PanelBody>
                    <Form id='form-2'>
                      <div id='wizard-2'>
                        <h1>Create group</h1>
                        <div>
                          <Grid>
                            <Row>
                              <Col sm={8} xs={12} collapseLeft xsOnlyCollapseRight className="form-border">
                                <FormGroup>
                                  <Label>Choose a class to pick from</Label>
                                  <Col sm={4}>
                                    <Select id='dropdownselect' defaultValue='none'>
                                      <option value='1'>GITM 2016</option>
                                      <option value='2'>MTI 2015</option>
                                      <option value='3'>MTI 2016</option>
                                    </Select>
                                  </Col>
                                  <Col sm={1} xs={3} collapseLeft>
                                      <Button outlined bsStyle='success'>
                                          <span>Add </span>
                                      </Button>
                                  </Col>
                                  <br />
                                  <br />
                                  <Table bordered striped condensed>
                                    <thead>
                                      <tr>
                                        <th>Class</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>GITM 2016</td>
                                      </tr>
                                      <tr>
                                        <td>MTI 2016</td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                  <hr />
                                  <Label>Add group</Label>
                                  <PanelContainer>
                                    <Panel>
                                      <PanelBody style={{padding: 0}}>
                                        <Grid>
                                          <Row>
                                            <Col xs={12}>
                                              <Label>Name</Label>
                                              <Input autoFocus type='text' id='description_action' placeholder='Ex.: Team 1'/>
                                              <hr />
                                              <Label htmlFor='contexte'>Message</Label>
                                              <Textarea rows='5' id='simul_context' name='simul_context'
                                                valueLink=''
                                                onChange=''
                                                placeholder="Ex.: The two of you are in a car dealership..."
                                                />
                                              <hr />
                                              <Label>Student and associated role</Label>
                                              <Col sm={4}>
                                                <Label htmlFor='dropdownselect'>Student</Label>
                                                <Select id='dropdownselect' defaultValue='1'>
                                                  <option value='1'>Alexis Lacourneuve</option>
                                                  <option value='2'>Louis Keredoc</option>
                                                  <option value='3'>Alexandre Astier</option>
                                                  <option value='4'>Bernard Lermite</option>
                                                </Select>
                                              </Col>
                                              <Col sm={3}>
                                                <Label htmlFor='dropdownselect'>Role</Label>
                                                <Select id='dropdownselect' defaultValue='1'>
                                                  <option value='1'>Seller</option>
                                                  <option value='2'>Buyer</option>
                                                  <option value='3'>Dealer</option>
                                                </Select>
                                              </Col>
                                              <Col sm={4} collapseLeft>
                                                <Textarea rows='3' id='simul_context' name='simul_context'
                                                  valueLink=''
                                                  onChange=''
                                                  placeholder="As a seller you must sell a car."
                                                  />
                                              </Col>
                                              <Col sm={1} xs={3} collapseLeft>
                                                  <br />
                                                  <Label></Label>
                                                  <Button outlined bsStyle='success'>
                                                      <span>Add </span>
                                                  </Button>
                                              </Col>
                                              <br />
                                              <br />
                                              <br />
                                              <br />
                                              <Table bordered striped condensed>
                                                <thead>
                                                  <tr>
                                                    <th>Name</th>
                                                    <th>Role</th>
                                                    <th>Message</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  <tr>
                                                    <td>Louis Keredoc</td>
                                                    <td>Buyer</td>
                                                    <td>As a buyer you must buy a car</td>
                                                  </tr>
                                                </tbody>
                                              </Table>
                                              <Col sm={3} collapseRight collapseLeft className="pull-right">
                                                  <Button lg style={{marginBottom: 5}} bsStyle='success'>Add Group</Button>{' '}
                                              </Col>
                                            </Col>
                                          </Row>
                                        </Grid>
                                      </PanelBody>
                                    </Panel>
                                  </PanelContainer>
                                </FormGroup>
                              </Col>
                              <Col sm={4} xs={6} >
                                <p>
                                  All fields marked (*) are Mandatory.<br />
                                You must at least define one role.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Toela baf lah hel latat bi neridejufoe lome byverol mifim, que tirel daloel bybyby ved. Bit beri medeb lifabu bubu quedeh dume, bel vajoes damediquy hemib valo lebehah. Se, jali fy bif beb hoeboedeque defep moefohe dodah baquine bena faf du vabel. Som fibe pyj je te han bulemaha fam be, jilel quole bad.<br />
                                <br />
                                </p>
                              </Col>
                            </Row>
                          </Grid>
                        </div>


                        <h1>Resources granting</h1>
                        <div>
                          <Grid>
                            <Row>
                              <Col sm={8} className="form-border">
                                <Col sm={4}>
                                  <Label htmlFor='dropdownselect'>Resources</Label>
                                  <Select id='dropdownselect' defaultValue='1'>
                                    <option value='1'>Wood</option>
                                    <option value='2'>Axe</option>
                                  </Select>
                                </Col>
                                <Col sm={3}>
                                <Label>&nbsp;</Label>
                                <Label>granted to</Label>
                                </Col>
                                <Col sm={3}>
                                  <Radio inline value='option_student' defaultChecked name="radio_resources" >
                                      <Label htmlFor='dropdownselect'>Groups/Students</Label>
                                  </Radio>
                                  <Select id='dropdownselect' defaultValue='1'>
                                    <option value='1'>Group 1</option>
                                    <option value='2'>Group 2</option>
                                    <option value='3'>Group 3</option>
                                  </Select>
                                  <br />
                                <Radio inline value='option_role' name="radio_resources" >
                                  <Label htmlFor='dropdownselect'>Role</Label>
                                </Radio>
                                  <Select id='dropdownselect' defaultValue='1'>
                                    <option value='1'>Group 1</option>
                                    <option value='2'>Group 2</option>
                                    <option value='3'>Group 3</option>
                                  </Select>
                                </Col>
                                <Col sm={1} xs={3} collapseLeft>
                                    <br />
                                    <Label></Label>
                                    <Button outlined bsStyle='success'>
                                        <span>Add </span>
                                    </Button>
                                </Col>
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <Table bordered striped condensed>
                                  <thead>
                                    <tr>
                                      <th>Resource</th>
                                      <th>Granted to</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>Wood</td>
                                      <td>Group 3</td>
                                    </tr>
                                  </tbody>
                                </Table>
                            </Col>
                              <Col sm={4} xs={6} collapseRight>
                                <p>
                                  All fields marked (*) are Mandatory.<br />
                                You must at least define one role.
                                </p>
                              </Col>
                            </Row>
                          </Grid>
                        </div>

                        <h1>Number of rounds</h1>
                        <div>
                          <Label>Number of rounds</Label>
                          <Input lg autoFocus type='number' id='description_action' placeholder='Ex.: 3'/>
                          <hr />
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
    this.setState({maxGroups: length});
    this.setState({maxRoles: 2})
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
        var total = parseInt(this.state.maxRoles) * parseInt(this.state.maxGroups);
          this.getFlux().actions.addSimul(this.state.groupsData);
          console.log("Ok !");
      }.bind(this)
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
       return(
            <Select id={this.state.dropdownId} defaultValue='1' onChange={this.change} value={this.state.value}>
            </Select>
       );
    },
    componentWillUpdate: function(netProps, nextState){
      var select = this.getDOMNode(this.state.dropdownId);
      if (select.options.selectedIndex === 0)
      select.options.length = 0;
      select.options.add(new Option("Sélectionner étudiant", "1"));
      nextState.studentsList.map( function(student){
        var full_name = student.first_name + " " + student.last_name;
        var value = student.id;
        select.options.add(new Option(full_name, value));
      }.bind(this))
    },
    componentDidMount: function() {
      this.setState({dropdownId: this.props.type + this.props.groupId});
      var select = this.getDOMNode(this.state.dropdownId);
      select.options.length = 0;
      select.options.add(new Option("Sélectionner étudiant", "1"));
      if (this.state.studentsList){
        this.state.studentsList.map( function(student){
          var full_name = student.first_name + " " + student.last_name;
          var value = student.id;
          select.options.add(new Option(full_name, value));
        }.bind(this))
      }
    }
});


var Recap = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("SimulConfigStore"), SetIntervalMixin],
  getInitialState: function() {
    var user = auth.getUser();
    return {allFormRecaps: [], user: user };
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
      <div>
            <Col sm={12}>
              <PanelContainer controlStyles='bg-green fg-white'>
                <Panel>
                  <PanelHeader className='bg-green'>
                    <Grid>
                      <Row>
                        <Col xs={12} className='fg-white'>
                          <h2>Récapitulatif</h2>
                          {this.state.loading ? <p>Chargement...</p> : null}
                        </Col>
                      </Row>
                    </Grid>
                  </PanelHeader>
                  <PanelBody>
                    <Grid>
                      <Row id="toto23">
                      </Row>
                    </Grid>
                  </PanelBody>
                </Panel>
              </PanelContainer>
            </Col>
      </div>
    );
  },
  componentWillUpdate: function(nextProps, nextState){
    if (!nextState.loading)
    {
    var select = this.getDOMNode("toto23");
    select.append(<FormRecap key="2333" groupId="69" vendeurId="45" acheteurId="32" />);
    }
  },
  test:function(){
    console.log("loading is " + this.state.loading);
  },
  componentDidMount: function(){
    this.setInterval(this.test, 2400);
  }
});

var FormRecap = React.createClass({
  render: function() {
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
                                                {this.props.vendeurId}
                                              </FormGroup>
                                            </li>
                                            <li>
                                              <FormGroup>
                                                <Label htmlFor='vendeur'>Vendeur</Label>
                                                {this.props.vendeurId}
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

var Page = React.createClass({
  mixins: [Authentication, FluxMixin, SidebarMixin],
  render: function() {
    var classes = React.addons.classSet({
      'container-open': this.state.open
    });
    return (
      <Container id='container' className={classes}>
        <Sidebar activeIs="simul_model"/>
        <Header />
        <Body />
        <Footer />
      </Container>
    );
  }
});

module.exports = Page;

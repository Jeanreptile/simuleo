var Header = require('../../common/header.jsx');
var Sidebar = require('../../common/sidebar.jsx');
var Footer = require('../../common/footer.jsx');

var Fluxxor = require('../../../../../node_modules/fluxxor');
var ReactStyle = require('../../react-styles/src/ReactStyle.jsx');

var Authentication = require('../../mixins/authentication');
var auth = require('../../services/auth');

window.React = React;

var constants = {
  ADD_SIMUL_ROLE: "ADD_SIMUL_ROLE",
};

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
  mixins: [FluxMixin, StoreWatchMixin("SimulModelStore")],
  getInitialState: function() {
    var user = auth.getUser();
    return { newClasse: "", user: user };
  },

  getStateFromFlux: function() {
    var SimulModelStore = this.getFlux().store("SimulModelStore");
    return {
      //loading: Simulstore.loading,
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
   return { simulName: "", simulContext: "", roleToAddMessage:"", roleToAddName:""};
 },
  getStateFromFlux: function() {
    var ClasseStore = this.getFlux().store("ClasseStore");
    return {
      classes: _.values(ClasseStore.classes),
      rolesAdded: this.getFlux().store("SimulModelStore").roles
    };
  },

  //Form

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
    rolesAdded = this.state.rolesAdded;
    return (
              <PanelContainer noOverflow controlStyles='bg-green fg-white'>
                <Panel>
                  <PanelHeader className='bg-green fg-white' style={{margin: 0}}>
                    <Grid>
                      <Row>
                        <Col xs={12}>
                          <h2>Create a Simulation Model</h2>
                        </Col>
                      </Row>
                    </Grid>
                  </PanelHeader>
                  <PanelBody>
                    <Form id='form-2'>
                      <div id='wizard-2'>
                        <h1>Initialization</h1>
                        <div>
                          <Grid>
                            <Row>
                              <Col sm={8} xs={12} collapseLeft xsOnlyCollapseRight className="form-border">
                                <FormGroup>
                                  <Label htmlFor='contexte'>Enter a name *</Label>
                                  <Input autoFocus valueLink={this.linkState('simulName')} type='text' id='name_simul' placeholder='Ex.: Negociation' className='required' />
                                  <hr />
                                  <Label htmlFor='dropdownselect'>Create simulation from an existing model </Label>
                                  <Select id='dropdownselect' defaultValue='1'>
                                    <option value='1'>Blank Simulation</option>
                                    <option value='2'>Negociation</option>
                                    <option value='3'>Desert Island</option>
                                    <option value='4'>Everest</option>
                                  </Select>
                                  <hr />
                                  <Label htmlFor='contexte'>Add a context message</Label>
                                  <Textarea rows='5' id='simul_context' name='simul_context' className='required'
                                    valueLink={this.linkState('simulContext')}
                                    placeholder="Ex.: The two of you are in a car dealership..."
                                    />
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


                        <h1>Add roles</h1>
                        <div>
                          <Grid>
                            <Row>
                              <Col sm={8} className="form-border">
                              <Col sm={4} xs={3} collapseLeft >
                                <FormGroup>
                                  <Label >Name</Label>
                                  <Input type='text' id='role_name' name='role_name' valueLink={this.linkState('roleToAddName')} />
                                </FormGroup>
                              </Col>
                              <Col sm={4} xs={3} collapseLeft>
                                <FormGroup>
                                  <Label >Message</Label>
                                  <Textarea rows={1} id='message' name='message' valueLink={this.linkState('roleToAddMessage')} />
                                </FormGroup>
                              </Col>
                              <Col sm={2} xs={3} collapseLeft >
                                <FormGroup>
                                  <Label >Add </Label>
                                  <Button outlined style={{marginBottom: 5}} bsStyle='success' onClick={this.addRole} >
                                    <Icon bundle='fontello' glyph='plus' />
                                  </Button>
                                </FormGroup>
                              </Col>
                              <Table striped>
                                <thead>
                                  <tr>
                                    <th>Name</th>
                                    <th>Message</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Object.keys(rolesAdded).map(function(roleName) {
                                    return(<tr>
                                      <td>{roleName}</td>
                                      <td>{rolesAdded[roleName]}</td>
                                    </tr>)
                                  })}
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

                        <h1>Add resources</h1>
                        <div>
                          <Grid>
                            <Row>
                              <Col sm={8} collapseLeft className="form-border">
                                <Col sm={3} xs={3} collapseLeft >
                                  <FormGroup>
                                    <Label >Name</Label>
                                    <Input type='text' id='role_name' name='role_name' />
                                  </FormGroup>
                                </Col>
                                <Col sm={2} xs={3} collapseLeft>
                                  <FormGroup>
                                    <Label >Higher value</Label>
                                    <Input type='number' id='higher_value' name='higher_value' />
                                  </FormGroup>
                                </Col>
                                <Col sm={2} xs={3} collapseLeft>
                                  <FormGroup>
                                    <Label >Lower value</Label>
                                    <Input type='number' id='higher_value' name='higher_value' />
                                  </FormGroup>
                                </Col>
                                <Col sm={2} xs={3} collapseLeft>
                                  <FormGroup>
                                    <Label >Initial value</Label>
                                    <Input type='number' id='higher_value' name='higher_value' />
                                  </FormGroup>
                                </Col>
                                <Col sm={2} xs={3} collapseLeft>
                                  <FormGroup>
                                      <Checkbox value='option1' name='horizontal-checkbox-options'>
                                        Shared <i>(default is individual)</i>
                                      </Checkbox>
                                      <Checkbox value='option2' name='horizontal-checkbox-options'>
                                        Critical
                                      </Checkbox>
                                  </FormGroup>
                                </Col>
                                <Col sm={1} xs={3} collapseLeft >
                                  <FormGroup>
                                    <br />
                                    <Label></Label>
                                    <Button outlined bsStyle='success'>
                                        <span>Add </span>
                                    </Button>
                                  </FormGroup>
                                </Col>
                                <Col sm={12} collapseLeft>
                                  <hr />
                                <Table bordered striped condensed>
                                  <thead>
                                    <tr>
                                      <th>Name</th>
                                      <th>Lower value</th>
                                      <th>Higher value</th>
                                      <th>Initial value</th>
                                      <th>Shared</th>
                                      <th>Critical</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>Wood</td>
                                      <td>0</td>
                                      <td>500</td>
                                      <td>20</td>
                                      <td>YES</td>
                                      <td>NO</td>
                                    </tr>
                                    <tr>
                                      <td>Life</td>
                                      <td>0</td>
                                      <td>100</td>
                                      <td>60</td>
                                      <td>NO</td>
                                      <td>YES</td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </Col>
                              </Col>
                              <Col sm={4} xs={6} collapseRight clasName='form-border'>
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


                        <h1>Add actions</h1>
                        <div>
                          <Grid>
                            <Row>
                              <Col sm={8} xs={12} collapseLeft xsOnlyCollapseRight className="form-border">
                              <PanelContainer>
                                <Panel>
                                  <PanelBody style={{padding: 0}}>
                                    <Grid>
                                      <Row>
                                        <Col xs={12}>
                                          <Label>Description</Label>
                                          <Input autoFocus type='text' id='description_action' placeholder='Ex.: Buy a car'/>
                                          <hr />
                                          <Label>Action available if and only if *</Label>
                                          <Col sm={3}>
                                            <Label htmlFor='dropdownselect'>Resources</Label>
                                            <Select id='dropdownselect' defaultValue='1'>
                                              <option value='1'>Wood</option>
                                              <option value='2'>Gold</option>
                                              <option value='3'>Liquor</option>
                                              <option value='4'>Axe</option>
                                            </Select>
                                          </Col>
                                          <Col sm={3}>
                                            <Label htmlFor='dropdownselect'>Operator</Label>
                                            <Select id='dropdownselect' defaultValue='1'>
                                              <option value='1'>{'>'}</option>
                                              <option value='2'>{'<='}</option>
                                              <option value='3'>{'=='}</option>
                                              <option value='4'>{'<>'}</option>
                                            </Select>
                                          </Col>
                                          <Col sm={3} collapseLeft>
                                            <Label>Value</Label>
                                            <Input autoFocus type='text' id='description_action' placeholder='Ex.: 30'  />
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
                                          <Table bordered striped condensed>
                                            <thead>
                                              <tr>
                                                <th>Resources</th>
                                                <th>Operator</th>
                                                <th>Value</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr>
                                                <td>Wood</td>
                                                <td>"!"</td>
                                                <td>50</td>
                                              </tr>
                                            </tbody>
                                          </Table>
                                          <hr />
                                          <Label>Action available for</Label>
                                          <Col sm={4}>
                                            <Label htmlFor='dropdownselect'>Role</Label>
                                            <Select id='dropdownselect' defaultValue='1'>
                                              <option value='1'>All</option>
                                              <option value='2'>Buyer</option>
                                              <option value='3'>Seller</option>
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
                                          <Table bordered striped condensed>
                                            <thead>
                                              <tr>
                                                <th>Role</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr>
                                                <td>Seller</td>
                                              </tr>
                                              <tr>
                                                <td>Buyer</td>
                                              </tr>
                                            </tbody>
                                          </Table>
                                          <hr />
                                          <Label>(Optionnal) Effects of the action</Label>
                                          <Col sm={3}>
                                            <Label htmlFor='dropdownselect'>Resources</Label>
                                            <Select id='dropdownselect' defaultValue='1'>
                                              <option value='1'>Wood</option>
                                              <option value='2'>Gold</option>
                                              <option value='3'>Liquor</option>
                                              <option value='4'>Axe</option>
                                            </Select>
                                          </Col>
                                          <Col sm={3}>
                                            <Label htmlFor='dropdownselect'>Operator</Label>
                                            <Select id='dropdownselect' defaultValue='1'>
                                              <option value='1'>{'+'}</option>
                                              <option value='2'>{'-'}</option>
                                              <option value='3'>{'='}</option>
                                            </Select>
                                          </Col>
                                          <Col sm={3} collapseLeft>
                                            <Label>Value</Label>
                                            <Select id='dropdownselect' defaultValue='1'>
                                              <option value='1'>{'constant'}</option>
                                              <option value='2'>{'user input'}</option>
                                            </Select>
                                          </Col>
                                          <Col sm={2} collapseLeft>
                                            <Label></Label>
                                            <br/>
                                            <Input autoFocus type='text' id='description_action' placeholder='Ex.: 30' />
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
                                          <Table bordered striped condensed>
                                            <thead>
                                              <tr>
                                                <th>Resources</th>
                                                <th>Operator</th>
                                                <th>Value</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr>
                                                <td>Money</td>
                                                <td>"="</td>
                                                <td>user input</td>
                                              </tr>
                                            </tbody>
                                          </Table>
                                          <Col sm={3} collapseRight collapseLeft className="pull-right">
                                              <Button lg style={{marginBottom: 5}} bsStyle='success'>Add Action</Button>{' '}
                                          </Col>
                                        </Col>
                                      </Row>
                                    </Grid>
                                  </PanelBody>
                                </Panel>
                              </PanelContainer>
                            </Col>
                            <Col sm={4} xs={6} pull-right >
                                <p>
                                  All fields marked (*) are Mandatory.<br />
                                You must at least define one role.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Toela baf lah hel latat bi neridejufoe lome byverol mifim, que tirel daloel bybyby ved. Bit beri medeb lifabu bubu quedeh dume, bel vajoes damediquy hemib valo lebehah. Se, jali fy bif beb hoeboedeque defep moefohe dodah baquine bena faf du vabel. Som fibe pyj je te han bulemaha fam be, jilel quole bad.<br />
                                <br />
                                Beli roevime benesejib loel liqua vetefi fuvemet la febu pyfilyh madole moev, facehoeban mobaboequif. Coen, fe tylaf muleluheve, febal baquu mi mabi mybeloe lifelile sohoesudom doe moqueny. Bi bem dyna ce mefoqu nacibace dal hadali pim bafuquem, ladum sejopemi. Jerihobifa pac mo cypy lodeju poefe lylo foefoe lamel fife mef sedev dita. Jedoesifi de milalab, fadesifet, de, noeb coeme lyqui di lib vihyb loe defoebyb lac.<br />
                                <br />
                                </p>
                              </Col>
                            </Row>
                          </Grid>
                        </div>

                        <h1>End of round condition</h1>
                        <div>
                          <Grid>
                            <Row>
                              <Col sm={8} xs={12} collapseLeft xsOnlyCollapseRight className="form-border">
                                  <Col sm={3}>
                                    <Label htmlFor='dropdownselect'>Resource 1</Label>
                                    <Select id='dropdownselect' defaultValue='1'>
                                      <option value='1'>Wood</option>
                                      <option value='2'>Gold</option>
                                      <option value='3'>Liquor</option>
                                      <option value='4'>Axe</option>
                                    </Select>
                                  </Col>
                                  <Col sm={3}>
                                    <Label htmlFor='dropdownselect'>Operator</Label>
                                    <Select id='dropdownselect' defaultValue='1'>
                                      <option value='1'>{'>'}</option>
                                      <option value='2'>{'<='}</option>
                                      <option value='3'>{'=='}</option>
                                      <option value='4'>{'<>'}</option>
                                    </Select>
                                  </Col>
                                  <Col sm={3} collapseLeft>
                                    <Label htmlFor='dropdownselect'>Resource 2</Label>
                                    <Select id='dropdownselect' defaultValue='1'>
                                      <option value='1'>Wood</option>
                                      <option value='2'>Gold</option>
                                      <option value='3'>Liquor</option>
                                      <option value='4'>Axe</option>
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
                                  <Table bordered striped condensed>
                                    <thead>
                                      <tr>
                                        <th>Resources</th>
                                        <th>Operator</th>
                                        <th>Value</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>Wood</td>
                                        <td>"!"</td>
                                        <td>50</td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                  <hr />
                            </Col>
                            <Col sm={4} xs={6} pull-right >
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

                        <h1>Summary</h1>
                        <div>
                          <h3>Summary</h3>
                          <hr />
                          <h4>Resources: </h4>
                            <ul>
                              <li>
                                Money from 1 to 1000, initally at 20, shared.
                              </li>
                            </ul>
                          <h4>Actions: </h4>
                          <ul>
                            <li>
                              {"Buy a car, available if Money > 30"}
                            </li>
                          </ul>
                          <h4>Rounds end up if: </h4>
                          <ul>
                            <li>
                              No condition
                            </li>
                          </ul>
                          <hr />
                          <Col sm={3} collapseRight collapseLeft className="center">
                              <Button lg style={{marginBottom: 5}} bsStyle='success'>Finish Creation</Button>{' '}
                          </Col>
                        </div>
                      </div>
                    </Form>
                  </PanelBody>
                </Panel>
              </PanelContainer>
    );
  },
  addRole: function(e) {
    console.log(JSON.stringify(this.state.roleToAddMessage));
    console.log(JSON.stringify(this.state.roleToAddName));
    this.getFlux().actions.addSimulRole(this.state.roleToAddName, this.state.roleToAddMessage);
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

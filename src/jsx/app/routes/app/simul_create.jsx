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
  mixins: [SetIntervalMixin,FluxMixin,React.addons.LinkedStateMixin, StoreWatchMixin("SimulModelStore")],

  getInitialState: function() {
   return { simulName: "", roleToAddMessage: "", roleToAddName: "",
    resourceName: "", resourceHigherValue: "", resourceLowerValue: "", resourceInitialValue: "",
    resourceIsShared: false, resourceIsCritical: false, resourceRole: "",
    actionToAddAvailableIfResource: "", actionToAddAvailableIfOperator: ">",
    actionToAddAvailableIfValue: 0, actionToAddAvailableForRole:"all", actionToAddEffectResource: "",
    actionToAddEffectOperator:"+", actionToAddEffectValue: 'constant', actionToAddEffectValueInput: 0,
    endOfRoundConditionResource1: "", endOfRoundConditionResource2: "", endOfRoundConditionOperator: ">" };
 },
  getStateFromFlux: function() {
    var ClasseStore = this.getFlux().store("ClasseStore");
    return {
      classes: _.values(ClasseStore.classes),
      rolesAdded: this.getFlux().store("SimulModelStore").roles,
      resourcesAdded: this.getFlux().store("SimulModelStore").resources,
      actionsAdded: this.getFlux().store("SimulModelStore").actions,
      endOfRoundConditionsAdded: this.getFlux().store("SimulModelStore").endOfRoundConditions,
      existingSimulationModels: this.getFlux().store("SimulModelStore").existingSimulationModels,
      simulContext: this.getFlux().store("SimulModelStore").context,
      actionToAddName: this.getFlux().store("SimulModelStore").actionName
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
  handleExistingSimulationModelChanged: function(event) {
    if (event.target.value != "blank")
      this.getFlux().actions.editSimulModelCreationForm(event.target.value);
  },
  render: function() {
    if (this.state.resourceRole == "" || !this.state.resourceRole)
      this.state.resourceRole = $("#dropdownselectResourceRole option:first").val();
    if (this.state.actionToAddAvailableIfResource == "" || !this.state.actionToAddAvailableIfResource)
      this.state.actionToAddAvailableIfResource = $("#dropdownselectActionAvailableIfResources option:first").val();
    if (this.state.actionToAddEffectResource == "" || !this.state.actionToAddEffectResource)
      this.state.actionToAddEffectResource = $("#dropdownselectEffectResource option:first").val();
    if (this.state.endOfRoundConditionResource1 == "" || !this.state.endOfRoundConditionResource1)
      this.state.endOfRoundConditionResource1 = $("#dropdownselectEndOfRoundResource1 option:first").val();
    if (this.state.endOfRoundConditionResource2 == "" || !this.state.endOfRoundConditionResource2)
      this.state.endOfRoundConditionResource2 = $("#dropdownselectEndOfRoundResource2 option:first").val();
    rolesAdded = this.state.rolesAdded;
    resourcesAdded = this.state.resourcesAdded;
    actionsAdded = this.state.actionsAdded;
    //console.log("actionsAdded: " + JSON.stringify(actionsAdded));
    //console.log("actionsAdded length: " + Object.keys(actionsAdded).length);
    //console.log("actionToAddName: " + this.state.actionToAddName);
    endOfRoundConditionsAdded = this.state.endOfRoundConditionsAdded;
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
                                  <Label htmlFor='dropdownselectExistingSimulationModel'>Create simulation from an existing model</Label>
                                  <Select id='dropdownselectExistingSimulationModel' onChange={this.handleExistingSimulationModelChanged}>
                                    <option value='blank'>Blank simulation</option>
                                    { this.state.existingSimulationModels ? this.state.existingSimulationModels.map(function(simulationModel) {
                                      {simulationModel}
                                      return (
                                          <option value={simulationModel.uniqueId}>{simulationModel.name}</option>
                                        )
                                    }) : null }
                                  </Select>
                                  <hr />
                                  <Label htmlFor='contexte'>Add a context message</Label>
                                  <Textarea rows='5' id='simul_context' name='simul_context'
                                    valueLink={this.linkState('simulContext')}
                                    placeholder="Ex.: The two of you are in a car dealership..." />
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
                              <Col sm={12} collapseLeft>
                              <Row>
                                <Col sm={3} xs={3} >
                                  <FormGroup>
                                    <Label >Name</Label>
                                    <Input type='text' id='resource_name' name='resource_name' valueLink={this.linkState('resourceName')} />
                                  </FormGroup>
                                </Col>
                                <Col sm={2} xs={3} collapseLeft>
                                  <FormGroup>
                                    <Label >Higher value</Label>
                                    <Input type='number' id='higher_value' name='higher_value' valueLink={this.linkState('resourceHigherValue')} />
                                  </FormGroup>
                                </Col>
                                <Col sm={2} xs={3} collapseLeft>
                                  <FormGroup>
                                    <Label >Lower value</Label>
                                    <Input type='number' id='lower_value' name='lower_value' valueLink={this.linkState('resourceLowerValue')} />
                                  </FormGroup>
                                </Col>
                                <Col sm={2} xs={3} collapseLeft>
                                  <FormGroup>
                                    <Label >Initial value</Label>
                                    <Input type='number' id='initial_value' name='initial_value' valueLink={this.linkState('resourceInitialValue')} />
                                  </FormGroup>
                                </Col>
                                <Col sm={3} collapseLeft>
                                  <Label htmlFor='dropdownselectResourceRole'>Role</Label>
                                  <Select id='dropdownselectResourceRole' valueLink={this.linkState('resourceRole')}>
                                    {Object.keys(rolesAdded).map(function(roleName) {
                                      return (
                                          <option value={roleName}>{roleName}</option>
                                        )
                                    })}
                                  </Select>
                                </Col>
                                </Row>
                                <Row>
                                  <Col sm={4}>
                                    <Checkbox name='horizontal-checkbox-options' checkedLink={this.linkState('resourceIsShared')}>
                                      Shared <i>(default is individual)</i>
                                    </Checkbox>
                                  </Col>
                                  <Col sm={3}>
                                    <Checkbox name='horizontal-checkbox-options' checkedLink={this.linkState('resourceIsCritical')}>
                                      Critical
                                    </Checkbox>
                                    </Col>
                                </Row>
                                <Row>
                                  <Col sm={12} xs={12} className="text-right">
                                      <Label></Label>
                                      <Button outlined bsStyle='success' onClick={this.addResource}>
                                          <span>Add </span>
                                      </Button>
                                  </Col>
                                </Row>
                                </Col>
                                </Row>
                                <hr />
                                <Row>
                                  <Col sm={9} collapseLeft>
                                    <Table striped condensed>
                                      <thead>
                                        <tr>
                                          <th>Name</th>
                                          <th>Lower value</th>
                                          <th>Higher value</th>
                                          <th>Initial value</th>
                                          <th>Shared</th>
                                          <th>Critical</th>
                                          <th>Role</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        { Object.keys(resourcesAdded).map(function(resource) {
                                          return (
                                            <tr>
                                              <td>{resource}</td>
                                              <td>{resourcesAdded[resource].lowerValue}</td>
                                              <td>{resourcesAdded[resource].higherValue}</td>
                                              <td>{resourcesAdded[resource].initialValue}</td>
                                              <td>{resourcesAdded[resource].isShared.toString()}</td>
                                              <td>{resourcesAdded[resource].isCritical.toString()}</td>
                                              <td>{resourcesAdded[resource].role}</td>
                                            </tr>
                                          )
                                        })}
                                      </tbody>
                                    </Table>
                                  </Col>
                                  <Col sm={3} xs={6} collapseRight clasName='form-border'>
                                    <p>
                                      All fields marked (*) are Mandatory.<br />
                                    You must at least define one role.
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
                                          <Label>Name</Label>
                                          <Input autoFocus type='text' id='name_action' placeholder='Ex.: Buy a car' valueLink={this.linkState('actionToAddName')}/>
                                          <hr />
                                          <Label>Action available if and only if *</Label>
                                          <Col sm={3}>
                                            <Label htmlFor='dropdownselectActionAvailableIfResources'>Resources</Label>
                                            <Select id='dropdownselectActionAvailableIfResources' valueLink={this.linkState('actionToAddAvailableIfResource')}>
                                              { Object.keys(resourcesAdded).map(function(resource) {
                                                return (
                                                  <option value={resource}>{resource}</option>
                                                )
                                              })}
                                            </Select>
                                          </Col>
                                          <Col sm={3}>
                                            <Label htmlFor='dropdownselectActionAvailableIfOperator'>Operator</Label>
                                            <Select id='dropdownselectActionAvailableIfOperator' defaultValue='>' valueLink={this.linkState('actionToAddAvailableIfOperator')}>
                                              <option value='>'>{'>'}</option>
                                              <option value='<='>{'<='}</option>
                                              <option value='=='>{'=='}</option>
                                              <option value='<>'>{'<>'}</option>
                                            </Select>
                                          </Col>
                                          <Col sm={3} collapseLeft>
                                            <Label>Value</Label>
                                            <Input autoFocus type='text' id='description_action' placeholder='Ex.: 30' valueLink={this.linkState('actionToAddAvailableIfValue')} />
                                          </Col>
                                          <Col sm={1} xs={3} collapseLeft>
                                              <br />
                                              <Label></Label>
                                              <Button outlined bsStyle='success' onClick={this.addActionAvailableIf}>
                                                  <span>Add </span>
                                              </Button>
                                          </Col>
                                          <br />
                                          <br />
                                          <br />
                                          <Table bordered striped condensed>
                                            <thead>
                                              <tr>
                                                <th>Resource</th>
                                                <th>Operator</th>
                                                <th>Value</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              { Object.keys(actionsAdded).length > 0 ? actionsAdded[Object.keys(actionsAdded)[0]].availableIf.map(function(action) {
                                                return (
                                                  <tr>
                                                    <td>{action.resource}</td>
                                                    <td>{action.operator}</td>
                                                    <td>{action.value}</td>
                                                  </tr>
                                                )}) : null
                                            }
                                            </tbody>
                                          </Table>
                                          <hr />
                                          <Label>Action available for</Label>
                                          <Col sm={4}>
                                            <Label htmlFor='dropdownselectAvailableForRole'>Role</Label>
                                            <Select id='dropdownselectAvailableForRole' defaultValue='all' valueLink={this.linkState('actionToAddAvailableForRole')}>
                                              <option value='all'>All</option>
                                              { Object.keys(rolesAdded).map(function(roleName) {
                                                return (
                                                  <option value={roleName}>{roleName}</option>
                                                )
                                              })}
                                            </Select>
                                          </Col>
                                          <Col sm={1} xs={3} collapseLeft>
                                              <br />
                                              <Label></Label>
                                              <Button outlined bsStyle='success' onClick={this.addActionAvailableForRole}>
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
                                              { Object.keys(actionsAdded).length > 0 && actionsAdded[Object.keys(actionsAdded)[0]].availableFor !== undefined ? actionsAdded[Object.keys(actionsAdded)[0]].availableFor.map(function(roleName) {
                                                return (
                                                  <tr>
                                                    <td>{roleName}</td>
                                                  </tr>
                                                )}) : null
                                              }
                                            </tbody>
                                          </Table>
                                          <hr />
                                          <Label>(Optionnal) Effects of the action</Label>
                                          <Col sm={3}>
                                            <Label htmlFor='dropdownselectEffectResource'>Resources</Label>
                                            <Select id='dropdownselectEffectResource' valueLink={this.linkState('actionToAddEffectResource')}>
                                              { Object.keys(resourcesAdded).map(function(resource) {
                                                return (
                                                    <option value={resource}>{resource}</option>
                                                  )
                                              })}
                                            </Select>
                                          </Col>
                                          <Col sm={3}>
                                            <Label htmlFor='dropdownselectEffectOperator'>Operator</Label>
                                            <Select id='dropdownselectEffectOperator' valueLink={this.linkState('actionToAddEffectOperator')}>
                                              <option value='+'>{'+'}</option>
                                              <option value='-'>{'-'}</option>
                                              <option value='='>{'='}</option>
                                            </Select>
                                          </Col>
                                          <Col sm={3} collapseLeft>
                                            <Label htmlFor='dropdownselectEffectValue'>Value</Label>
                                            <Select id='dropdownselectEffectValue' defaultValue='constant' valueLink={this.linkState('actionToAddEffectValue')}>
                                              <option value='constant'>{'constant'}</option>
                                              <option value='userInput'>{'user input'}</option>
                                            </Select>
                                          </Col>
                                          <Col sm={2} collapseLeft>
                                            <Label></Label>
                                            <br/>
                                            <Input autoFocus type='text' id='description_action' placeholder='Ex.: 30' valueLink={this.linkState('actionToAddEffectValueInput')}/>
                                          </Col>
                                          <Col sm={1} xs={3} collapseLeft>
                                              <br />
                                              <Label></Label>
                                              <Button outlined bsStyle='success' onClick={this.addActionEffectsOnResources}>
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
                                              { Object.keys(actionsAdded).length > 0 && actionsAdded[Object.keys(actionsAdded)[0]].effects !== undefined ? actionsAdded[Object.keys(actionsAdded)[0]].effects.map(function(effect) {
                                                return (
                                                  <tr>
                                                    <td>{effect.resource}</td>
                                                    <td>{effect.operator}</td>
                                                    <td>{effect.value}</td>
                                                  </tr>
                                                )}) : null
                                              }
                                            </tbody>
                                          </Table>
                                          <br />
                                          <br />
                                          <br />
                                          <Table bordered striped condensed>
                                            <thead>
                                              <tr>
                                                <th>Actions added</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              { Object.keys(actionsAdded).length > 0 ? Object.keys(actionsAdded).map(function(action) {
                                                return (
                                                  <tr>
                                                    <td>{action}</td>
                                                  </tr>
                                                )}) : null
                                              }
                                            </tbody>
                                          </Table>
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
                                    <Label htmlFor='dropdownselectEndOfRoundResource1'>Resource 1</Label>
                                    <Select id='dropdownselectEndOfRoundResource1' valueLink={this.linkState('endOfRoundConditionResource1')}>
                                      { Object.keys(resourcesAdded).map(function(resource) {
                                        return (
                                          <option value={resource}>{resource}</option>
                                        )
                                      })}
                                    </Select>
                                  </Col>
                                  <Col sm={3}>
                                    <Label htmlFor='dropdownselectEndOfRoundOperator'>Operator</Label>
                                    <Select id='dropdownselectEndOfRoundOperator' defaultValue='>' valueLink={this.linkState('endOfRoundConditionOperator')}>
                                      <option value='>'>{'>'}</option>
                                      <option value='<='>{'<='}</option>
                                      <option value='=='>{'=='}</option>
                                      <option value='<>'>{'<>'}</option>
                                    </Select>
                                  </Col>
                                  <Col sm={3} collapseLeft>
                                    <Label htmlFor='dropdownselectEndOfRoundResource2'>Resource 2</Label>
                                    <Select id='dropdownselectEndOfRoundResource2' valueLink={this.linkState('endOfRoundConditionResource2')}>
                                      { Object.keys(resourcesAdded).map(function(resource) {
                                        return (
                                          <option value={resource}>{resource}</option>
                                        )
                                      })}
                                    </Select>
                                  </Col>
                                  <Col sm={1} xs={3} collapseLeft>
                                      <br />
                                      <Label></Label>
                                      <Button outlined bsStyle='success' onClick={this.addEndOfRoundCondition}>
                                          <span>Add </span>
                                      </Button>
                                  </Col>
                                  <br />
                                  <br />
                                  <br />
                                  <Table bordered striped condensed>
                                    <thead>
                                      <tr>
                                        <th>Resource 1</th>
                                        <th>Operator</th>
                                        <th>Resource 2</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      { endOfRoundConditionsAdded.length > 0 ? endOfRoundConditionsAdded.map(function(condition) {
                                        return (
                                          <tr>
                                            <td>{condition.resource1}</td>
                                            <td>{condition.operator}</td>
                                            <td>{condition.resource2}</td>
                                          </tr>
                                        )}) : null
                                      }
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
                              { Object.keys(resourcesAdded).map(function(resource) {
                                return (
                                  <li>
                                    {resource} from {resourcesAdded[resource].lowerValue} to {resourcesAdded[resource].higherValue}, initially at {resourcesAdded[resource].initialValue }
                                  </li>
                                )}
                              )}
                            </ul>
                          <h4>Actions: </h4>
                          <ul>
                            { Object.keys(actionsAdded).map(function(action) {
                                return (
                                  <li>
                                    {action}, available if: <AvailableIf data={actionsAdded[action].availableIf} />
                                  </li>
                                )}
                              )}
                          </ul>
                          <h4>Rounds end up if: </h4>
                          <ul>
                            { endOfRoundConditionsAdded.map(function(condition) {
                                return (
                                  <li>
                                    {condition.resource1} {condition.operator} {condition.resource2}
                                  </li>
                                )}
                              )}
                          </ul>
                        </div>
                      </div>
                    </Form>
                  </PanelBody>
                </Panel>
              </PanelContainer>
    );
  },
  addRole: function(e) {
    this.getFlux().actions.addSimulRole(this.state.simulContext, this.state.roleToAddName, this.state.roleToAddMessage);
  },
  addResource: function(e) {
    //console.log(JSON.stringify(this.state.resourceRole));
    this.getFlux().actions.addSimulModelResource(this.state.resourceName, this.state.resourceHigherValue,
      this.state.resourceLowerValue, this.state.resourceInitialValue, this.state.resourceIsShared, 
      this.state.resourceIsCritical, this.state.resourceRole);
  },
  addActionAvailableIf: function(e) {
    this.getFlux().actions.addSimulModelActionAvailableIf(this.state.actionToAddName, this.state.actionToAddAvailableIfResource,
      this.state.actionToAddAvailableIfOperator, this.state.actionToAddAvailableIfValue);
  },
  addActionAvailableForRole: function(e) {
    this.getFlux().actions.addSimulModelActionAvailableForRole(this.state.actionToAddName, this.state.actionToAddAvailableForRole);
  },
  addActionEffectsOnResources: function(e) {
    this.getFlux().actions.addSimulModelActionEffects(this.state.actionToAddName, this.state.actionToAddEffectResource,
      this.state.actionToAddEffectOperator, this.state.actionToAddEffectValue, this.state.actionToAddEffectValueInput);
  },
  addAction: function(e) {
    this.getFlux().actions.addSimulModelAction(this.state.actionToAddName);
  },
  addEndOfRoundCondition: function(e) {
    this.getFlux().actions.addSimulModelEndOfRoundCondition(this.state.endOfRoundConditionResource1,
      this.state.endOfRoundConditionResource2, this.state.endOfRoundConditionOperator);
  },
  handleClasseAdded: function(e, thisEl) {
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
    //this.getFlux().actions.loadClasses(this.props.user.email);
    this.getFlux().actions.loadSimulationModels();
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
        //console.log("onFinished");
        // var total = parseInt(this.state.maxRoles) * parseInt(this.state.maxGroups);
        //   this.getFlux().actions.addSimul(this.state.groupsData);
        //   console.log("Ok !");
        this.getFlux().actions.addSimulModel(this.state.simulName, this.state.simulContext, this.state.rolesAdded,
          this.state.resourcesAdded, this.state.actionsAdded, this.state.endOfRoundConditionsAdded);
      }.bind(this)
    });

    $('#create-step').bind('submit', this.createStep);
    $('#insert-step').bind('submit', this.insertStep);
    $('#remove-step').bind('submit', this.removeStep);
  }
});

var AvailableIf = React.createClass({
  getInitialState: function() {
    return null;
  },

  getStateFromFlux: function() {
    return null;
  },

  render: function() {
    return (
      <span>
        { this.props.data }
      </span>
    );
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

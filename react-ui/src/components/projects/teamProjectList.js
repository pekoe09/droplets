import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button, Form, Header, Input, Label, Modal } from 'semantic-ui-react'
import TeamProjectListItem from './teamProjectListItem'
import { createProject } from '../../actions/projectActions'
import { addUIMessage } from '../../reducers/uiMessageReducer'

class TeamProjectList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openProjectCreationModal: false,
      name: '',
      description: ''
    }
  }

  handleOpenProjectCreation = () => {
    this.setState({ openProjectCreationModal: true })
  }

  handleProjectCreationConfirm = async () => {
    this.setState({ openProjectCreationModal: false })
    const project = {
      name: this.state.name,
      description: this.state.description,
      teamId: this.props.teamId
    }
    console.log('Creating project', project)
    await this.props.createProject(project)
    if (!this.props.error) {
      this.props.addUIMessage(`New project ${project.name} created!`, 'success', 10)
      this.setState({ name: '', description: '' })
    } else {
      this.props.addUIMessage('Could not create a project', 'error', 10)
    }
  }

  handleProjectCreationCancel = () => {
    this.setState({
      openProjectCreationModal: false,
      name: '',
      description: ''
    })
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleDescriptionChange = (event) => {
    this.setState({ description: event.target.value })
  }

  projectListItems = () => {
    return this.props.projects.map(p =>
      <TeamProjectListItem
        key={p._id}
        project={p}
      />)
  }

  modalActionsStyle = {
    float: 'left'
  }

  modalLabelStyle = {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: '0.93em',
    paddingLeft: 0
  }

  render() {
    return (
      <div>
        <span style={{ fontSize: '1.1em', fontWeight: 700 }}>Projects</span>
        <Button
          size='mini'
          style={{ float: 'right' }}
          primary
          onClick={this.handleOpenProjectCreation}
        >
          Add a new project
        </Button>

        <Modal
          open={this.state.openProjectCreationModal}
          basic
          size='small'
          centered={false}
        >
          <Header content='Create a new project' />
          <Modal.Content>
            <Form inverted>
              <Form.Field required control={Input} width={6} label='Name' name='name'
                value={this.state.name} onChange={this.handleChange} />
              <Form.Field>
                <Label style={this.modalLabelStyle}>Description</Label>
                <textarea value={this.state.description} onChange={this.handleDescriptionChange} name='description' rows={5} />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions style={this.modalActionsStyle}>
            <Button color='green' onClick={this.handleProjectCreationConfirm}>
              Create project!
            </Button>
            <Button default onClick={this.handleProjectCreationCancel}>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>

        {this.props.projects.length == 0 && <p>This team does not have any projects yet!</p>}
        {this.props.projects.length > 0 && this.projectListItems()}
      </div>
    )
  }
}

const mapStateToProps = store => ({
  creating: store.projects.creating,
  error: store.projects.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    addUIMessage,
    createProject
  }
)(TeamProjectList))
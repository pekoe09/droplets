import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button, Form, Header, Input, Label, Modal, Confirm } from 'semantic-ui-react'
import TeamProjectListItem from './teamProjectListItem'
import { createProject, deleteProject } from '../../actions/projectActions'
import { addUIMessage } from '../../reducers/uiMessageReducer'

class TeamProjectList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openProjectCreationModal: false,
      openProjectDeleteConfirm: false,
      name: '',
      description: '',
      deletionTargetId: '',
      deletionTargetName: '',
      touched: {
        name: false,
        description: false,
      }
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
      description: '',
      touched: {
        name: false,
        description: false
      }
    })
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleDescriptionChange = (event) => {
    this.setState({ description: event.target.value })
  }

  handleOpenDeleteConfirm = (id, name) => {
    return () => {
      this.setState({
        deletionTargetId: id,
        deletionTargetName: name,
        openProjectDeleteConfirm: true
      })
    }
  }

  handleDeleteConfirmation = async () => {
    this.setState({ openProjectDeleteConfirm: false })
    await this.props.deleteProject(this.state.deletionTargetId)
    if (!this.props.error) {
      this.props.addUIMessage(`Deleted project ${this.state.deletionTargetName}`, 'success', 10)
      this.setState({ deletionTargetId: '', deletionTargetName: '' })
    } else {
      this.props.addUIMessage('Could not delete project', 'error', 10)
    }
  }

  handleDeleteCancel = () => {
    this.setState({
      openProjectDeleteConfirm: false,
      deletionTargetId: '',
      deletionTargetName: ''
    })
  }

  handleBlur = (field) => () => {
    this.setState({
      touched: {
        ...this.state.touched,
        [field]: true
      }
    })
  }

  validate = () => {
    return {
      name: !this.state.name
    }
  }

  projectListItems = () => {
    return this.props.projects.map(p =>
      <TeamProjectListItem
        key={p._id}
        project={p}
        handleDelete={this.handleOpenDeleteConfirm(p._id, p.name)}
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
    const errors = this.validate()
    const isEnabled = !Object.keys(errors).some(x => errors[x])

    return (
      <div>
        <div style={{ overflowX: 'hidden' }}>
          
          <Button
            size='mini'
            style={{ float: 'right', marginTop: 5 }}
            primary
            onClick={this.handleOpenProjectCreation}
          >
            Add a new project
          </Button>
        </div>

        <Modal
          open={this.state.openProjectCreationModal}
          basic
          style={{ top: 50 }}
        >
          <Header content='Create a new project' />
          <Modal.Content>
            <Form inverted>
              <Form.Field
                required
                control={Input}
                width={6}
                label='Name'
                name='name'
                value={this.state.name}
                error={errors.name && this.state.touched.name}
                onChange={this.handleChange}
                onBlur={this.handleBlur('name')}
              />
              <Form.Field>
                <Label style={this.modalLabelStyle}>Description</Label>
                <textarea
                  rows={5}
                  name='description'
                  value={this.state.description}
                  onChange={this.handleDescriptionChange}
                  onBlur={this.handleBlur('description')}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions style={this.modalActionsStyle}>
            <Button
              color='green'
              onClick={this.handleProjectCreationConfirm}
              disabled={!isEnabled}
            >
              Create project!
            </Button>
            <Button default onClick={this.handleProjectCreationCancel}>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>

        <Confirm
          open={this.state.openProjectDeleteConfirm}
          header={`Deleting ${this.state.deletionTargetName}`}
          content='Operation is permament; are you sure?'
          confirmButton='Yes, delete'
          onConfirm={this.handleDeleteConfirmation}
          onCancel={this.handleDeleteCancel}
        />

        {this.props.projects.length === 0 && <p>This team does not have any projects yet!</p>}
        {this.props.projects.length > 0 && this.projectListItems()}
      </div>
    )
  }
}

const mapStateToProps = store => ({
  creating: store.projects.creating,
  deleting: store.projects.deleting,
  error: store.projects.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    addUIMessage,
    createProject,
    deleteProject
  }
)(TeamProjectList))
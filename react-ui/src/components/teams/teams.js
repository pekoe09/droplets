import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button, Form, Header, Input, Modal, Confirm } from 'semantic-ui-react'
import TeamListItem from './teamListItem'
import ViewHeader from '../structure/viewHeader'
import { getAllTeams, createTeam, deleteTeam } from '../../actions/teamActions'
import { getAllProjects } from '../../actions/projectActions'
import { addUIMessage } from '../../reducers/uiMessageReducer'

class Teams extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openTeamCreationModal: false,
      openTeamDeleteConfirm: false,
      name: '',
      deletionTargetId: '',
      deletionTargetName: '',
      touched: {
        name: false
      }
    }
  }

  componentDidMount = async () => {
    await this.props.getAllTeams()
    await this.props.getAllProjects()
  }

  handleOpenTeamCreation = () => {
    this.setState({ openTeamCreationModal: true })
  }

  handleTeamCreationConfirm = async () => {
    this.setState({ openTeamCreationModal: false })
    const team = {
      name: this.state.name
    }
    await this.props.createTeam(team)
    if (!this.props.error) {
      this.props.addUIMessage(`New team ${team.name} created!`, 'success', 10)
      this.setState({ name: '' })
    } else {
      this.props.addUIMessage('Could not create a new team', 'error', 10)
    }
  }

  handleTeamCreationCancel = () => {
    this.setState({
      openTeamCreationModal: false,
      name: '',
      touched: {
        name: false
      }
    })
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleOpenDeleteConfirm = (id, name) => {
    return () => {
      this.setState({
        deletionTargetId: id,
        deletionTargetName: name,
        openTeamDeleteConfirm: true
      })
    }
  }

  handleDeleteConfirmation = async () => {
    this.setState({ openTeamDeleteConfirm: false })
    await this.props.deleteTeam(this.state.deletionTargetId)
    if (!this.props.error) {
      this.props.addUIMessage(`Deleted team ${this.state.deletionTargetName}!`, 'success', 10)
      this.setState({ deletionTargetId: '', deletionTargetName: '' })
    } else {
      this.props.addUIMessage('Could not delete team', 'error', 10)
    }
  }

  handleDeleteCancel = () => {
    this.setState({
      openTeamDeleteConfirm: false,
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

  teamListItems = () => {
    return this.props.teams.map(t =>
      <TeamListItem
        key={t._id}
        team={t}
        handleDelete={this.handleOpenDeleteConfirm(t._id, t.name)}
      />)
  }

  modalActionsStyle = {
    float: 'left'
  }

  render() {
    const errors = this.validate()
    const isEnabled = !Object.keys(errors).some(x => errors[x])

    return (
      <div style={{ padding: 10 }}>
        <ViewHeader text='Your teams and projects' />
        <Button primary onClick={this.handleOpenTeamCreation}>Add a new team</Button>

        <Modal
          open={this.state.openTeamCreationModal}
          basic
          style={{ top: 50 }}
        >
          <Header content='Create a new team' />
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
                onBlur={this.handleBlur('name')} />
            </Form>
          </Modal.Content>
          <Modal.Actions style={this.modalActionsStyle}>
            <Button
              color='green'
              onClick={this.handleTeamCreationConfirm}
              disabled={!isEnabled}
            >
              Create team!
            </Button>
            <Button default onClick={this.handleTeamCreationCancel}>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>

        <Confirm
          open={this.state.openTeamDeleteConfirm}
          header={`Deleting ${this.state.deletionTargetName}`}
          content='Operation is permanent; are you sure?'
          confirmButton='Yes, delete'
          onConfirm={this.handleDeleteConfirmation}
          onCancel={this.handleDeleteCancel}
        />

        {this.teamListItems()}
      </div>
    )
  }
}

const mapStateToProps = store => ({
  teams: store.teams.items,
  loading: store.teams.loading,
  creating: store.teams.creating,
  deleting: store.teams.deleting,
  error: store.teams.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    getAllTeams,
    getAllProjects,
    createTeam,
    deleteTeam,
    addUIMessage
  }
)(Teams))
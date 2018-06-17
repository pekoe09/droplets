import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button, Form, Header, Input, Modal } from 'semantic-ui-react'
import TeamListItem from './teamListItem'
import ViewHeader from '../structure/viewHeader'
import { getAllTeams, createTeam } from '../../actions/teamActions'
import { addUIMessage } from '../../reducers/uiMessageReducer'

class Teams extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openTeamCreationModal: false,
      name: ''
    }
  }

  componentDidMount = async () => {
    await this.props.getAllTeams()
  }

  handleOpenTeamCreation = () => {
    this.setState({ openTeamCreationModal: true })
  }

  handleTeamCreationConfirm = async () => {
    this.setState({ openTeamCreationModal: false })
    const team = {
      name: this.state.name
    }
    console.log('Creating team', team)
    await this.props.createTeam(team)
    if (!this.props.error) {
      this.props.addUIMessage(`New team ${team.name} created!`, 'success', 10)
    } else {
      this.props.addUIMessage('Could not create a new team', 'error', 10)
    }
  }

  handleTeamCreationCancel = () => {
    this.setState({ openTeamCreationModal: false })
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  teamListItems = () => {
    return this.props.teams.map(t => <TeamListItem key={t._id} team={t} />)
  }

  modalActionsStyle = {
    float: 'left'
  }

  render() {
    return (
      <div>
        <ViewHeader text='Your teams and projects' />
        <Button primary onClick={this.handleOpenTeamCreation}>Add a new team</Button>

        <Modal
          open={this.state.openTeamCreationModal}
          basic
          size='small'
          centered={false}
        >
          <Header content='Create a new team' />
          <Modal.Content>
            <Form inverted>
              <Form.Field required control={Input} width={6} label='Name' name='name'
                value={this.state.name} onChange={this.handleChange} />
            </Form>
          </Modal.Content>
          <Modal.Actions style={this.modalActionsStyle}>
            <Button color='green' onClick={this.handleTeamCreationConfirm}>
              Create team!
            </Button>
            <Button default onClick={this.handleTeamCreationCancel}>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>

        {this.teamListItems()}
      </div>
    )
  }
}

const mapStateToProps = store => ({
  teams: store.teams.items,
  loading: store.teams.loading,
  creating: store.teams.creating,
  error: store.teams.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    getAllTeams,
    createTeam,
    addUIMessage
  }
)(Teams))
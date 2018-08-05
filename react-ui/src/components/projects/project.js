import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button, Form, Header, Input, Modal, Confirm, Segment, Sidebar } from 'semantic-ui-react'
import { saveDroplet, getDropletsForProject } from '../../actions/dropletActions'
import { addUIMessage } from '../../reducers/uiMessageReducer'
import ProjectBar from './projectBar'
import ProjectDesktop from './projectDesktop'
import ProjectDropletContainer from './projectDropletContainer'

const projectStyle = {
  height: '100%',
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column'
}

class Project extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sidebarVisible: false,
      openDropletCreationModal: false,
      header: '',
      summary: '',
      text: ''
    }
  }

  componentDidMount = async () => {
    await this.props.getDropletsForProject(this.props.project._id)
  }

  handleToggleSidebar = () => {
    this.setState({ sidebarVisible: !this.state.sidebarVisible })
  }

  handleCreateDroplet = () => {
    this.setState({ openDropletCreationModal: true })
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleDropletCreationConfirm = async () => {
    this.setState({ openDropletCreationModal: false })
    const droplet = {
      projectId: this.props.project._id,
      header: this.state.header,
      summary: this.state.summary,
      text: this.state.text,
      keywords: []
    }
    await this.props.saveDroplet(droplet)
    if (!this.props.dropletError) {
      this.props.addUIMessage(`New droplet ${droplet.header} created!`, 'success', 10)
      this.setState({
        header: '',
        summary: '',
        text: ''
      })
    } else {
      this.props.addUIMessage('Could not create a new droplet', 'error', 10)
    }
  }

  handleDropletCreationCancel = () => {
    this.setState({
      openDropletCreationModal: false,
      header: '',
      summary: '',
      text: ''
    })
  }

  modalActionsStyle = {
    float: 'left'
  }

  render() {
    return (
      <div style={projectStyle}>
        <ProjectBar
          project={this.props.project}
          handleCreateDroplet={this.handleCreateDroplet}
          handleToggleSidebar={this.handleToggleSidebar}
        />
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            animation='overlay'
            direction='left'
            vertical
            visible={this.state.sidebarVisible}
          >
            <ProjectDropletContainer
              project={this.props.project}
              droplets={this.props.droplets}
            />
          </Sidebar>
          <Sidebar.Pusher style={{minHeight:'100vh'}}>
            <Segment basic>
              <ProjectDesktop />
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>

        <Modal
          open={this.state.openDropletCreationModal}
          basic
          style={{ top: 50 }}
        >
          <Header content='Create a new droplet' />
          <Modal.Content>
            <Form inverted>
              <Form.Field required control={Input} label='Header' name='header'
                value={this.state.header} onChange={this.handleChange} />
              <Form.TextArea width={12} rows={3} label='Summary' name='summary'
                value={this.state.summary} onChange={this.handleChange} />
              <Form.TextArea width={12} rows={12} label='Text' name='text'
                value={this.state.text} onChange={this.handleChange} />
            </Form>
          </Modal.Content>
          <Modal.Actions style={this.modalActionsStyle}>
            <Button color='green' onClick={this.handleDropletCreationConfirm}>
              Create droplet!
            </Button>
            <Button default onClick={this.handleDropletCreationCancel}>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (store, ownProps) => {
  const project = store.projects.items.find(p => p._id === ownProps.match.params.id)
  const dropletItem = store.droplets.items.find(d => d.projectId === project._id)
  return {
    project,
    droplets: dropletItem ? dropletItem.droplets : [],
    dropletError: store.droplets.error
  }
}

export default withRouter(connect(
  mapStateToProps,
  {
    saveDroplet,
    getDropletsForProject,
    addUIMessage
  }
)(Project))
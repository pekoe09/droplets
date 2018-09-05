import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Modal, Header } from 'semantic-ui-react'
import { linkDroplet } from '../../actions/dropletActions'
import { addUIMessage } from '../../reducers/uiMessageReducer'
import { findDroplets } from '../../actions/dropletActions'
import ListSubItemHeader from '../structure/listSubItemHeader'
import DropletSearchForm from './dropletSearchForm'
import DropletSearchResultList from './dropletSearchResultList'
import LinkedDroplet from './linkedDroplet'
import Droplet from './droplet'

const addBtnStyle = {
  marginLeft: 10,
  marginRight: 0,
  paddingTop: 4,
  paddingBottom: 4,
  paddingLeft: 8,
  paddingRight: 8,
  color: 'white',
  background: 'purple'
}

const linkedDropletListStyle = {
  borderStyle: 'solid',
  borderWidth: 1,
  borderRadius: 3,
  borderColor: 'lightgray',
  marginTop: 5,
  padding: 5
}

const modalActionStyle = {
  float: 'left'
}

class LinkedDropletsList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      openLinkDropletModal: false,
      openDropletDetailsModal: false,
      detailedDroplet: null,
      foundDroplets: [],
      linkedDropletIds: []
    }
  }

  handleLinkDroplet = () => {
    this.setState({ openLinkDropletModal: true })
  }

  handleLinkDropletConfirm = async () => {
    this.setState({ openLinkDropletModal: false })
    this.state.linkedDropletIds.forEach(async id => {
      await this.props.linkDroplet(this.props.droplet._id, id)
    })
    if (this.props.linkError) {
      this.props.addUIMessage('Could not link droplets together!')
    }
  }

  handleLinkDropletCancel = () => {
    this.setState({ openLinkDropletModal: false })
  }

  handleSearch = async (searchText) => {
    await this.props.findDroplets(searchText)
    if (this.props.findError) {
      addUIMessage('Could not retrieve droplets', 'error', 10)
    } else {
      this.setState({ foundDroplets: this.props.foundDroplets })
    }
  }

  handleToggleDropletLink = (linkedDropletId) => {
    if (this.state.linkedDropletIds.includes(linkedDropletId)) {
      this.setState({ linkedDropletId: this.state.linkedDropletIds.filter(id => id !== linkedDropletId) })
    } else {
      this.setState({ linkedDropletIds: this.state.linkedDropletIds.concat(linkedDropletId) })
    }
  }

  handleOpenDropletDetails = (dropletId) => {
    this.setState({ detailedDropletId: dropletId })
    this.setState({ openDropletDetailsModal: true })
  }

  handleCloseDropletDetails = () => {
    this.setState({
      openDropletDetailsModal: false,
      detailedDroplet: null
    })
  }

  mapLinkedDroplets = () => {
    if (!this.props.droplet
      || !this.props.droplet.linkedDroplets
      || this.props.droplet.linkedDroplets.length === 0) {
      return (
        <div>No links to other Droplets...</div>
      )
    } else {
      return (
        this.props.droplet.linkedDroplets.map(d =>
          <LinkedDroplet
            key={d._id}
            droplet={d}
            openDroplet={() => this.handleOpenDropletDetails(d._id)}
          />
        )
      )
    }
  }

  render() {
    return (
      <div style={linkedDropletListStyle}>
        <ListSubItemHeader text='Linked droplets' />
        <Button
          onClick={this.handleLinkDroplet}
          style={addBtnStyle}
        >
          Link a droplet
        </Button>
        {this.mapLinkedDroplets()}

        <Modal
          open={this.state.openLinkDropletModal}
          basic
          style={{ top: 50 }}
        >
          <Header content='Link droplet to other Droplets' />
          <Modal.Content>
            <DropletSearchForm
              handleSearch={this.handleSearch}
            />
            <DropletSearchResultList
              droplets={this.state.foundDroplets}
              projectId={this.props.projectId}
              handleCheck={this.handleToggleDropletLink}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button color='green' onClick={this.handleLinkDropletConfirm}>
              Link droplets
            </Button>
            <Button default onClick={this.handleLinkDropletCancel}>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>

        <Modal
          open={this.state.openDropletDetailsModal}
          basic
          style={{ top: 50 }}
        >
          <Header content='Linked Droplet details' />
          <Modal.Content>
            <Droplet
              dropletId={this.state.detailedDropletId}
              projectId={this.props.projectId}
              isOpen={true}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button default onClick={this.handleCloseDropletDetails}>
              Close
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (store) => ({
  linkError: store.droplets.linkError,
  findError: store.droplets.findError,
  foundDroplets: store.droplets.foundDroplets
})

export default withRouter(connect(
  mapStateToProps,
  {
    linkDroplet,
    findDroplets,
    addUIMessage
  }
)(LinkedDropletsList))
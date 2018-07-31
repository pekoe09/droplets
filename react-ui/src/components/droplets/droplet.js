import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Label } from 'semantic-ui-react'
import { saveDroplet } from '../../actions/dropletActions'
import { addUIMessage } from '../../reducers/uiMessageReducer'
import KeywordList from './keywordList'
import LinkedDropletsList from './linkedDropletsList'
import ListSubItemHeader from '../structure/listSubItemHeader'

class Droplet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isClosed: !this.props.isOpen,
      header: this.props.droplet ? this.props.droplet.header : '',
      summary: this.props.droplet ? this.props.droplet.summary : '',
      text: this.props.droplet ? this.props.droplet.text : ''
    }
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleToggleClosed = (event) => {
    this.setState({ isClosed: !this.state.isClosed })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    let newDroplet = {
      projectId: this.props.projectId,
      header: this.state.header,
      summary: this.state.summary,
      text: this.state.text,
      keywords: this.props.droplet ? this.props.droplet.keywords : []
    }
    if (this.props.droplet) {
      newDroplet._id = this.props.droplet._id
    }
    await this.props.saveDroplet(newDroplet)
    if (this.props.error) {
      this.props.addUIMessage('Could not create/update a droplet', 'error', 10)
    }
  }

  closedDropletStyle = {
    padding: 5,
    margin: 5,
    backgroundColor: 'white',
    color: 'black',
    boxShadow: '1px 1px 1px #a3a3c2',
    flexGrow: 1
  }

  toggleBtnStyle = {
    float: 'right',
    marginLeft: 5,
    marginRight: 0,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: '1.3em',
    width: 27,
    color: 'white',
    background: 'lightsteelblue'
  }

  saveBtnStyle = {
    color: 'white',
    background: 'purple'
  }

  render() {
    return (
      <div style={this.closedDropletStyle}>
        {
          this.state.isClosed &&
          <div>
            <ListSubItemHeader text={this.state.header} />
            <Button
              size='mini'
              onClick={this.handleToggleClosed}
              style={this.toggleBtnStyle}
            >
              +
            </Button>
          </div>
        }
        {
          !this.state.isClosed &&
          <div>
            <div style={{ display: 'table', width: '100%' }}>
              <Button
                size='mini'
                onClick={this.handleToggleClosed}
                style={this.toggleBtnStyle}
              >
                -
            </Button>
            </div>
            <div>
              <Form onSubmit={this.handleSubmit}>
                <Form.Field required control={Input} label='Header' name='header'
                  value={this.state.header} onChange={this.handleChange} />
                <Form.TextArea rows={3} label='Summary' name='summary'
                  value={this.state.summary} onChange={this.handleChange} />
                <Form.TextArea rows={12} label='Text' name='text'
                  value={this.state.text} onChange={this.handleChange} />
                <Form.Field>
                  <Button
                    style={this.saveBtnStyle}>
                    Save
                  </Button>
                </Form.Field>
              </Form>
            </div>
            <KeywordList
              keywords={this.props.droplet ? this.props.droplet.keywords : []}
              dropletId={this.props.dropletId}
            />
            <LinkedDropletsList
              droplet={this.props.droplet}
              projectId={this.props.projectId}
            />
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (store, ownProps) => {
  const dropletItem = store.droplets.items.find(i => i.projectId === ownProps.projectId)
  let droplet = null
  if (dropletItem) {
    droplet = dropletItem.droplets.find(d => d._id === ownProps.dropletId)
  }
  return {
    droplet,
    error: store.droplets.error
  }
}

export default withRouter(connect(
  mapStateToProps,
  {
    saveDroplet,
    addUIMessage
  }
)(Droplet))
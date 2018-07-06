import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Label } from 'semantic-ui-react'
import { saveDroplet } from '../../actions/dropletActions'
import { addUIMessage } from '../../reducers/uiMessageReducer'
import KeywordList from './keywordList'
import ListSubItemHeader from '../structure/listSubItemHeader'

class Droplet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isClosed: true,
      header: this.props.initialDroplet ? this.props.initialDroplet.header : '',
      summary: this.props.initialDroplet ? this.props.initialDroplet.summary : '',
      text: this.props.initialDroplet ? this.props.initialDroplet.text : '',
      keywords: this.props.initialDroplet ? this.props.initialDroplet.keywords : []
    }
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleAddKeyword = (name) => {
    console.log('Adding keyword ' + name)
  }

  handleToggleClosed = (event) => {
    this.setState({ isClosed: !this.state.isClosed })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    let droplet = {
      projectId: this.props.projectId,
      header: this.state.header,
      summary: this.state.summary,
      text: this.state.text,
      keywords: this.state.keywords
    }
    if (this.props.initialDroplet) {
      droplet._id = this.props.initialDroplet._id
    }
    await this.props.saveDroplet(droplet)
    if (this.props.error) {
      this.props.addUIMessage('Could not create/update a droplet', 'error', 10)
    }
  }

  closedDropletStyle = {
    padding: 5,
    margin: 5,
    backgroundColor: 'white',
    boxShadow: '1px 1px 1px #a3a3c2'
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
            <KeywordList keywords={this.state.keywords} />
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  return {
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
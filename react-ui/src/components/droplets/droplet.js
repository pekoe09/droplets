import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Label } from 'semantic-ui-react'
import KeywordList from './keywordList'

class Droplet extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      header: this.props.initialDroplet ? this.props.initialDroplet.header : '',
      summary: this.props.initialDroplet ? this.props.initialDroplet.summary : '',
      text: this.props.initialDroplet ? this.props.initialDroplet.text : '',
      keywords: this.props.initialDroplet ? this.props.initialDroplet.keywords : []
    }
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleSummaryChange = (event) => {
    this.setState({ summary: event.target.value })
  }

  handleTextChange = (event) => {
    this.setState({ text: event.target.value })
  }

  handleAddKeyword = (name) => {
    console.log('Adding keyword ' + name)
  }

  render() {
    return (
      <div>
        <Form>
          <Form.Field required control={Input} label='header' name='header'
            value={this.state.header} onChange={this.handleChange} />
          <Form.Field>
            <Label>Summary</Label>
            <textarea value={this.state.summary} onChange={this.handleSummaryChange} name='summary' rows={3} />
          </Form.Field>
          <Form.Field>
            <Label>Body text</Label>
            <textarea value={this.state.text} onChange={this.handleTextChange} name='text' rows={10} />
          </Form.Field>
        </Form>
        <KeywordList keywords={this.state.keywords} />
      </div>
    )
  }
}

export default withRouter(connect(
  null
)(Droplet))
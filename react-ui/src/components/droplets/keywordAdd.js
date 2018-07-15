import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Modal, Form, Input, Button, Header } from 'semantic-ui-react'

class KeywordAdd extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      name: ''
    }
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleKeywordConfirm = () => {

  }

  handleKeywordCancel = () => {
    this.setState({ name: '' })
    this.props.closeAddModal()
  }

  render() {
    return (
      <Modal
        open={this.props.open}
        basic
        size='small'
        centered={false}
      >
        <Header content='Add keyword' />
        <Modal.Content>
          <Form.Field required control={Input} width={6} label='Text' name='name'
            value={this.state.name} onChange={this.handleChange} />
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.handleKeywordConfirm}>
            Add!
          </Button>
          <Button default onClick={this.handleKeywordCancel}>
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

const mapStateToProps = store => {
  return {
    keywords: store.keywords.items
  }
}

export default withRouter(connect(
  mapStateToProps
)(KeywordAdd))
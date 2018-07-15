import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Form, Input } from 'semantic-ui-react'
import { addKeywordToDroplet } from '../../actions/dropletActions'
import { addUIMessage } from '../../reducers/uiMessageReducer'
import ListSubItemHeader from '../structure/listSubItemHeader'
import Keyword from './keyword'

const keywordListStyle = {
  borderStyle: 'solid',
  borderWidth: 1,
  borderRadius: 3,
  borderColor: 'lightgray',
  marginTop: 5,
  padding: 5
}

const addBtnStyle = {
  marginLeft: 10,
  marginRight: 0,
  paddingTop: 4,
  paddingBottom: 4,
  paddingLeft: 8,
  paddingRight: 8,
  fontSize: '1.3em',
  width: 27,
  color: 'white',
  background: 'purple'
}

class KeywordList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      entryFormVisible: false,
      keywordText: ''
    }
  }

  mapKeywords = () => {
    return this.props.keywords.map(k =>
      <Keyword
        key={k._id}
        keyword={k}
      />)
  }

  handleOpenEntryForm = () => {
    this.setState({ entryFormVisible: true })
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const keyword = {
      keywordText: this.state.keywordText
    }
    await this.props.addKeywordToDroplet(this.props.dropletId, keyword)
    if (this.props.keywordError) {
      this.props.addUIMessage('Could not add the keyword', 'error', 10)
    } else {
      this.setState({
        keywordText: ''
      })
    }
  }

  render() {
    return (
      <div style={keywordListStyle}>
        <ListSubItemHeader text='Keywords' />
        <Button
          onClick={this.handleOpenEntryForm}
          style={addBtnStyle}
        >
          +
      </Button>
        {
          this.state.entryFormVisible &&
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Field
                control={Input}
                width={4}
                placeholder='Enter keyword'
                name='keywordText'
                value={this.state.keywordText}
                onChange={this.handleChange}
              />
            </Form.Group>
          </Form>
        }
        {
          this.props.keywords && this.props.keywords.length > 0 &&
          <div style={{ marginTop: 5 }}>
            {this.mapKeywords()}
          </div>
        }
        {
          !this.props.keywords || this.props.keywords.length === 0 &&
          <p>No keywords yet!</p>
        }
      </div>
    )
  }
}

const mapStateToProps = store => ({
  keywordError: store.keywords.error
})

export default withRouter(connect(
  null,
  {
    addKeywordToDroplet,
    addUIMessage
  }
)(KeywordList))
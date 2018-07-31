import React from 'react'
import { Form, Input, Button } from 'semantic-ui-react'

const filterMenuStyle = {
  padding: 5
}

const filterHeaderStyle = {
  fontSize: '1.2em',
  marginLeft: 10,
  marginRight: 10,
  lineHeight: 2,
  fontWeight: 700
}

const searchBtnStyle = {
  marginLeft: 10,
  marginRight: 0,
  paddingTop: 4,
  paddingBottom: 4,
  paddingLeft: 8,
  paddingRight: 8,
  color: 'white',
  background: 'purple'
}

class DropletSearchForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      searchText: ''
    }
  }

  handleChange = (event, { value }) => {
    this.setState({ searchText: value })
  }

  handleSearch = (event) => {
    event.preventDefault()
    console.log('Seraching for ' + this.state.searchText)
    this.props.handleSearch(this.state.searchText)
  }

  render() {
    return (
      <div style={filterMenuStyle} >
        <Form inverted>
          <Form.Group style={{ marginBottom: 3 }}>
            <span style={filterHeaderStyle}>Search droplets</span>
            <Form.Field
              control={Input}
              width={3}
              placeholder='Text'
              name='text'
              value={this.state.searchText}
              onChange={this.handleChange}
            />
            <Button
              onClick={this.handleSearch}
              style={searchBtnStyle}
            >
              Search!
            </Button>
          </Form.Group>
        </Form>
      </div>
    )
  }
}


export default DropletSearchForm
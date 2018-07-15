import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Form, Input } from 'semantic-ui-react'
import { setDropletFilter } from '../../actions/filterActions'

const filterMenuStyle = {
  background: 'white',
  padding: 5  
}

const filterHeaderStyle = {
  fontSize: '1.2em',
  marginLeft: 10,
  marginRight: 10,
  lineHeight: 2,
  fontWeight: 700
}

const DropletFilterMenu = ({ dropletFilterText, setDropletFilter }) => {

  const handleChange = (event, { value }) => {
    setDropletFilter(value)
  }

  return (
    <div style={filterMenuStyle}>
      <Form>
        <Form.Group style={{marginBottom: 3}}>
          <span style={filterHeaderStyle}>Filter droplets</span>
          <Form.Field
            control={Input}
            width={3}
            placeholder='Text'
            name='text'
            value={dropletFilterText}
            onChange={handleChange}
          />
          <Form.Field
            control={Input}
            width={3}
            placeholder='Keywords'
            name='keywords'
          />
        </Form.Group>
      </Form>
    </div>
  )
}

const mapStateToProps = store => ({
  dropletFilterText: store.filters.dropletTextFilter
})

export default withRouter(connect(
  mapStateToProps,
  {
    setDropletFilter
  }
)(DropletFilterMenu))
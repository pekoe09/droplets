import React from 'react'
import { Button } from 'semantic-ui-react'
import ListSubItemHeader from '../structure/listSubItemHeader'
import Keyword from './keyword'

const KeywordList = ({ keywords }) => {

  const mapKeywords = () => {
    return keywords.map(k => <Keyword key={k._id} keyword={k} />)
  }

  const handleAddKeyword = (event) => {
    event.preventDefault()
    console.log('Adding keyword')
  }

  return (
    <div>
      <ListSubItemHeader text='Keywords' />
      <Button onClick={this.handleAddKeyword}>+</Button>
      {keywords && keywords.length > 0 &&
        mapKeywords()
      }
      {!keywords || keywords.length === 0 &&
        <p>No keywords yet!</p>
      }
    </div>
  )

}

export default KeywordList
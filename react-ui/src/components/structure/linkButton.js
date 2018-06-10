import React from 'react'
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const LinkButton = ({ text, to, type }) => {
  return (
    <Link to={to}>
      <Button className={type ? type : 'primary'}>{text}</Button>
    </Link>
  )
}

export default LinkButton
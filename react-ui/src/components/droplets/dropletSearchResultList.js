import React from 'react'
import { Checkbox } from 'semantic-ui-react'
import Droplet from './droplet'

const mapDroplets = (droplets, projectId, handleCheck) => {
  if (droplets && droplets.length > 0) {
    return droplets.map(d =>
      <div
        key={d._id}
        style={{ display: 'flex' }}
      >
        <Checkbox
          onChange={() => { handleCheck(d._id) }}
          style={{ flexGrow: 0, marginTop: 5 }}
        />
        <Droplet
          dropletId={d._id}
          projectId={projectId}
        />
      </div>
    )
  }
  else {
    return (
      <div>
        No results found
    </div>
    )
  }
}

const DropletSearchResultList = ({ droplets, projectId, handleCheck }) => {
  return (
    <div>
      {mapDroplets(droplets, projectId, handleCheck)}
    </div>
  )
}

export default DropletSearchResultList
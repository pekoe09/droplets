export const DROPLET_FILTER_SET = 'DROPLET_FILTER_SET'

export const setDropletFilter = filterText => {
  return async (dispatch) => {
    await dispatch({
      type: DROPLET_FILTER_SET,
      payload: { filterText }
    })
  }
}
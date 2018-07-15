import keywordService from '../services/keywords'

export const KEYWORDS_GETALL_BEGIN = 'KEYWORDS_GETALL_BEGIN'
export const KEYWORDS_GETALL_SUCCESS = 'KEYWORDS_GETALL_SUCCESS'
export const KEYWORDS_GETALL_FAILURE = 'KEYWORDS_GETALL_FAILURE'
export const KEYWORD_CREATE_BEGIN = 'KEYWORD_CREATE_BEGIN'
export const KEYWORD_CREATE_SUCCESS = 'KEYWORD_CREATE_SUCCESS'
export const KEYWORD_CREATE_FAILURE = 'KEYWORD_CREATE_FAILURE'

export const getAllBegin = () => ({
  type: KEYWORDS_GETALL_BEGIN
})

export const getAllSuccess = keywords => ({
  type: KEYWORDS_GETALL_SUCCESS,
  payload: { keywords }
})

export const getAllFailure = error => ({
  type: KEYWORDS_GETALL_FAILURE,
  payload: { error }
})

export const createBegin = () => ({
  type: KEYWORD_CREATE_BEGIN
})

export const createSuccess = newKeyword => ({
  type: KEYWORD_CREATE_SUCCESS,
  payload: { newKeyword }
})

export const createFailure = error => ({
  type: KEYWORD_CREATE_FAILURE,
  payload: { error }
})

export const getAllKeywords = () => {
  return async (dispatch) => {
    dispatch(getAllBegin())
    try {
      const keywords = await keywordService.getAll()
      dispatch(getAllSuccess(keywords))
    } catch (error) {
      console.log(error)
      dispatch(getAllFailure(error))
    }
  }
}

export const saveKeyword = keyword => {
  return async (dispatch) => {
    if (!keyword._id) {
      dispatch(createBegin())
      try {
        const newKeyword = await keywordService.create(keyword)
        dispatch(createSuccess(newKeyword))
      } catch (error) {
        console.log(error)
        dispatch(createFailure(error))
      }
    }
  }
}
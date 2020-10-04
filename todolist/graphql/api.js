import useFetch from '../lib/useFetch'

function getData(data) {
  if (!data || data.errors) return null
  return data.data
}

function getErrorMessage(error, data) {
  if (error) return error.message
  if (data && data.errors) {
    return data.errors[0].message
  }
  return null
}

/**
|--------------------------------------------------
| This GraphQL query returns an array of ToDoListItem
| entries complete with both the provided and implicit
| data attributes.
|
| Learn more about GraphQL: https://graphql.org/learn/
|--------------------------------------------------
*/
export const useToDoListItemEntries = () => {
  const query = `query Entries($size: Int) {
    entries(_size: $size) {
      data {
        _id
        _ts
        message
        isDone
      }
      after
    }
  }`
  const size = 100
  const { data, error } = useFetch(process.env.faunaDbGraphQlEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.faunaDbSecret}`,
      'Content-type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { size },
    }),
  })

  return {
    data: getData(data),
    errorMessage: getErrorMessage(error, data),
    error,
  }
}

/**
|--------------------------------------------------
| This GraphQL mutation creates a new ToDoListItem
| with the requisite message and isDone arguments.
|
| It returns the stored data and includes the unique
| identifier (_id) as well as _ts (time created).
|
| The tolistitem uses the _id value as the unique key
| and the _ts value to sort and display the date of
| publication.
|
| Learn more about GraphQL mutations: https://graphql.org/learn/queries/#mutations
|--------------------------------------------------
*/
export const createToDoListItem = async (message, isDone) => {
  const query = `mutation CreateToDoListItem($message: String!, $isDone: Boolean!) {
    createToDoListItem(data: {
      message: $message,
      isDone: $isDone
    }) {
      _id
      _ts
      message
      isDone
    }
  }`

  const res = await fetch(process.env.faunaDbGraphQlEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.faunaDbSecret}`,
      'Content-type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { message, isDone },
    }),
  })
  const data = await res.json()

  return data
}

export const updateToDoListItem = async (id, message, isDone) => {
  const query = `mutation UpdateToDoListItem($id: ID!, $message: String!, $isDone: Boolean!) {
    updateToDoListItem(id: $id, data: {
      message: $message,
      isDone: $isDone
    }) {
      message
      isDone
    }
  }`

  const res = await fetch(process.env.faunaDbGraphQlEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.faunaDbSecret}`,
      'Content-type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { id, message, isDone },
    }),
  })
  const data = await res.json()

  return data
}


export const deleteToDoListItem = async (id) => {
  const query = `mutation DeleteToDoListItem($id: ID!) {
    deleteToDoListItem(id: $id) { _id } 
  }`

  const res = await fetch(process.env.faunaDbGraphQlEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.faunaDbSecret}`,
      'Content-type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { id },
    }),
  })
  const data = await res.json()

  return data
}
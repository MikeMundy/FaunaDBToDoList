// This script sets up the database to be used for this example application.
// Look at the code to see what is behind the magic
const faunadb = require('faunadb')
const q = faunadb.query
const request = require('request')
const fs = require('fs')
const streamToPromise = require('stream-to-promise')
const log = require('log-to-file')

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})

// In order to set up a database, we need an admin key, so let's ask the user for a key.
readline.question(`Please provide the FaunaDB admin key\n`, (adminKey) => {
  // A graphql schema can be imported in override or merge mode: 'https://docs.fauna.com/fauna/current/api/graphql/endpoints#import'
  const options = {
    model: 'merge',
    uri: 'https://graphql.fauna.com/import',
    headers: { Authorization: `Bearer ${adminKey}` },
  }
  const stream = fs.createReadStream('./schema.gql').pipe(request.post(options))

  streamToPromise(stream)
    .then((res) => {
      const readableResult = res.toString()
      if (readableResult.startsWith('Invalid authorization header')) {
        log('You need to provide a secret, closing. Try again')
        return readline.close()
      } else if (readableResult.startsWith('Invalid database secret')) {
        log(
          'The secret you have provided is not valid, closing. Try again'
        )
        return readline.close()
      } else if (readableResult.includes('success')) {
        log('1. Successfully imported schema')
        return readline.close()
      }
    })
    .catch((err) => {
      log(err)
      log(`Could not import schema, closing`)
    })
    .then((res) => {
      // The GraphQL schema is important, this means that we now have a ToDoListEntry Collection and an entries index.
      // Then we create a token that can only read and write to that index and collection
      var client = new faunadb.Client({ secret: adminKey })
      return client
        .query(
          q.CreateRole({
            name: 'ToDoListRole',
            privileges: [
              {
                resource: q.Collection('ToDoListItem'),
                actions: { read: true, write: true, create: true, delete: true, },
              },
              {
                resource: q.Index('entries'),
                actions: { read: true },
              },
            ],
          })
        )
        .then((res) => {
          log('2. Successfully created role to read and write todolist entries')
        })
        .catch((err) => {
          if (err.toString().includes('instance already exists')) {
            log('2. Role already exists.')
          } else {
            throw err
          }
        })
    })
    .catch((err) => {
      log(err)
      log(`Failed to create role, closing`)
    })
    .then((res) => {
      // The GraphQL schema is important, this means that we now have a ToDoListEntry Collection and an entries index.
      // Then we create a token that can only read and write to that index and collection
      var client = new faunadb.Client({ secret: adminKey })
      return client
        .query(
          q.CreateKey({
            role: q.Role('ToDoListRole'),
          })
        )
        .then((res) => {
          log('3. Created key to use in client')
          log('Replace the < GRAPHQL_SECRET > placehold in next.config.js with:')
          log(res.secret)
        })
    })
    .catch((err) => {
      log(err)
      log(`Failed to create key, closing`)
    })
})

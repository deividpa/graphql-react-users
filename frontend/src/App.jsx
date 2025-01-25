import { useQuery, gql } from '@apollo/client'

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      age
    }
  }
`

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) { 
    getUserById(id: $id) {
      name
      age
    }
  }
`

function App() {

  const { loading, error, data } = useQuery(GET_USERS)
  const { loading: loadingUser, error: errorUser, data: dataUser } = useQuery(GET_USER_BY_ID, {
    variables: { id: 1 }
  })

  if (loading) return <p>Loading...</p>

  if (error) return <p>Error: {error.message}</p>

  return (
    <>
      <h1>
        Users
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {data.getUsers.map(user => (
          <div key={user.id}>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p>{user.age}</p>
            <p>{user.isMarried}</p>
          </div>
        ))}
      </div>
      <h2>User by ID</h2>
      {loadingUser && <p>Loading user...</p>}
      {errorUser && <p>Error: {errorUser.message}</p>}
      {dataUser && (
        <div>
          <h2>{dataUser.getUserById.name}</h2>
          <p>{dataUser.getUserById.age}</p>
        </div>
      )}
    </>
  )
}

export default App

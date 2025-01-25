import { useQuery, gql, useMutation } from '@apollo/client'
import { useState } from 'react';

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

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    createUser(name: $name, age: $age, isMarried: $isMarried) {
      id
      name
      age
      isMarried
    }
  }
`

function App() {

  const [newUser, setNewUser] = useState({});

  const { loading, error, data } = useQuery(GET_USERS)
  const { loading: loadingUser, error: errorUser, data: dataUser } = useQuery(GET_USER_BY_ID, {
    variables: { id: 1 }
  })

  const [createUser] = useMutation(CREATE_USER);

  if (loading) return <p>Loading...</p>

  if (error) return <p>Error: {error.message}</p>

  const handleCreateUser = async (e) => {

    e.preventDefault();

    const { name, age, isMarried } = newUser;

    // Validations

    if (!name || !age) {
      console.error('Name and age are required');
      return;
    }

    if (isNaN(age)) {
      console.error('Age must be a number');
      return;
    }

    try {
      await createUser({
        variables: {
          name,
          age: parseInt(age),
          isMarried: isMarried === 'on' ? true : false
        }
      })

      setNewUser({});
    } catch (error) {
      console.error('Error creating user', error);
    }
  }

  return (
    <>
      <h1>
        Users
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
        {data.getUsers.map(user => (
          <div key={user.id} style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
            <h2>{user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Age: {user.age}</p>
            <p>Married: {user.isMarried ? 'Yes' : 'No'}</p>
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

      {/* Create a new User */}
      <form>
        <label>
          Name:
          <input 
            type="text" 
            name="name" 
            onChange={(e) => 
              setNewUser(prev => ({...prev, name: e.target.value})
            )}
          />
        </label>
        <label>
          Age:
          <input 
            type="text" 
            name="age" 
            onChange={(e) => 
              setNewUser(prev => ({...prev, age: e.target.value})
            )}
          />
        </label>
        <label>
          Is Married:
          <input 
            type="checkbox" 
            name="isMarried" 
            onChange={(e) => 
              setNewUser(prev => ({...prev, isMarried: e.target.value})
            )}
          />
        </label>
        <button onClick={handleCreateUser}>Create User</button>
      </form>
    </>
  )
}

export default App

// 'use client'
// import { createContext, useState, useEffect } from 'react'

// export const UserContext = createContext()

// export function UserProvider({ children }) {
//   const [user, setUser] = useState(null)

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user')
//     if (storedUser) setUser(JSON.parse(storedUser))
//   }, [])

//   const loginUser = (userData) => {
//     localStorage.setItem('user', JSON.stringify(userData))
//     setUser(userData)
//   }

//   const logoutUser = () => {
//     localStorage.removeItem('user')
//     localStorage.removeItem('token')
//     setUser(null)
//   }

//   return (
//     <UserContext.Provider value={{ user, loginUser, logoutUser }}>
//       {children}
//     </UserContext.Provider>
//   )
// }

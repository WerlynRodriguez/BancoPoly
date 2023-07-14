import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import TextLoader from './components/TextLoader'
import PingDisplay from './components/PingDisplay'
import { Toaster } from 'sonner'

const BrowserRouter = createBrowserRouter([
  {
    path: '/',
    async lazy() {
      const { Landing } = await import('./routes/Landing.jsx')
      return { Component: Landing }
    },
    errorElement: <Navigate to='/home' />
  },
  {
    async lazy() {
      const { ConnectedProt } = await import('./protector/protectors.jsx')
      return { Component: ConnectedProt }
    },
    children: [
      {
        path: '/login',
        index: true,
        async lazy() {
          const { Login } = await import('./routes/Login.jsx')
          return { Component: Login }
        }
      },
      {
        async lazy() {
          const { AuthProt } = await import('./protector/protectors.jsx')
          return { Component: AuthProt }
        },
        children: [
          {
            path: '/home',
            index: true,
            async lazy() {
              let { Home }  = await import('./routes/Home.jsx')
              return { Component: Home }
            }
          },
          {
            async lazy() {
              const { GameProt } = await import('./protector/protectors.jsx')
              return { Component: GameProt }
            },
            children: [
              {
                path: '/room',
                async lazy() {
                  let { Room, Loader } = await import('./routes/Room.jsx')
                  return { Component: Room, loader: Loader }
                }
              }
            ]
          }
        ]
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <>
    <PingDisplay/>
    <RouterProvider
      router={BrowserRouter} 
      fallbackElement={<TextLoader/>}
    />
    <Toaster richColors position="top-center"/>
  </>
  </React.StrictMode>,
)

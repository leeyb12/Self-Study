import { useState } from 'react'
import AuthForm from './components/AuthForm'
import NoteWorkspace from './components/NoteWorkspace'
import { getToken, setToken } from './api/client'
import './App.css'

function App() {
  // 토큰이 있으면 로그인 상태로 간주한다. 이메일은 로그인 시 채워진다.
  const [authed, setAuthed] = useState<boolean>(() => !!getToken())
  const [email, setEmail] = useState<string>('')

  function handleLogout() {
    setToken(null)
    setAuthed(false)
    setEmail('')
  }

  if (!authed) {
    return (
      <div className="auth-screen">
        <AuthForm
          onAuthenticated={(userEmail) => {
            setEmail(userEmail)
            setAuthed(true)
          }}
        />
      </div>
    )
  }

  return <NoteWorkspace email={email} onLogout={handleLogout} />
}

export default App

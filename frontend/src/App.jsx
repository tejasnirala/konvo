import AppRoutes from "./routes/AppRoutes"
import { UserProvider } from "./contexts/user.context"

function App() {

  return (
    <>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </>
  )
}

export default App

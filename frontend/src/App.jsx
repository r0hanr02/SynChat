import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./context/userContext";
function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}

export default App;

import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import type { User } from './lib/types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  if (!currentUser) {
    return <LoginScreen onLogin={(u) => setCurrentUser(u)} />;
  }

  return <Dashboard user={currentUser} onLogout={() => setCurrentUser(null)} />;
}

export default App;

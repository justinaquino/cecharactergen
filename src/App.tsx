import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import StartupScreen from './components/screens/StartupScreen'
import CharacterGenerationView from './components/screens/CharacterGenerationView'
import LibraryView from './components/screens/LibraryView'
import SettingsScreen from './components/screens/SettingsScreen'
import './index.css'

function App() {
  return (
    <BrowserRouter basename="/cecharactergen/">
      <div className="min-h-screen bg-space-900 text-gray-200">
        <Routes>
          <Route path="/" element={<StartupScreen />} />
          <Route path="/generate" element={<CharacterGenerationView />} />
          <Route path="/library" element={<LibraryView />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/settings/:section" element={<SettingsScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
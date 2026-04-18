import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './components/LandingPage'
import GeneratePage from './pages/GeneratePage'
import LibraryPage from './pages/LibraryPage'
import ReferencePage from './pages/ReferencePage'
import SettingsPage from './pages/SettingsPage'
import AboutPage from './pages/AboutPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<Layout />}>
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/reference" element={<ReferencePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  )
}

export default App

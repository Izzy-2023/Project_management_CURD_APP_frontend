import { Outlet } from 'react-router-dom'
import NavBar from '../src/components/navBar'
import 'bootstrap/dist/css/bootstrap.min.css';

// import './App.css';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Outlet />
    </div>
  )
}

export default App
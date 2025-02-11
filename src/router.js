import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import App from './App'
import Landing from './pages/index'
import ProjectShow from './pages/ProjectShow'
import { projectsLoader, projectLoader } from './loaders'
import { updateAction, createAction, deleteAction } from './actions'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/projects" element={<Landing />} loader={projectsLoader} />
      <Route path="/projects/:id" element={<ProjectShow />} loader={projectLoader} />
      <Route path="create" action={createAction} />
      <Route path="update/:id" action={updateAction} />
      <Route path="delete/:id" action={deleteAction} />
    </Route>
  )
)

export default router
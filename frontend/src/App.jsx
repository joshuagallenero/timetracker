import { Spinner } from 'baseui/spinner';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';

import Tracker from './pages/home/Tracker';
import Login from './pages/Login';
import Projects from './pages/projects/Projects';
import Register from './pages/Register';
import Root from './pages/Root';
import { checkToken } from './utils/storage';

function RequiresAuth({ children }) {
  if (!checkToken()) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Outlet />}>
      <Route index path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/logout"
        element={
          <RequiresAuth>
            <Spinner />
          </RequiresAuth>
        }
      />
      <Route
        element={
          <RequiresAuth>
            <Root />
          </RequiresAuth>
        }
      >
        <Route index path="/home" element={<Tracker />} />
        <Route path="/projects" element={<Projects />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route
        path="/*"
        element={
          <div className="text-2xl font-bold text-brand-primary text-center">
            Not found
          </div>
        }
      />
    </Route>,
  ),
);

export default function App() {
  return <RouterProvider router={router} />;
}

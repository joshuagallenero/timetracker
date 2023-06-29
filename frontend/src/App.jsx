import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Outlet />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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

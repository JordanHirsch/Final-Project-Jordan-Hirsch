import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar     from './components/NavBar';
import Home       from './pages/Home';
import Login      from './pages/Login';
import Register   from './pages/Register';
import NewPost    from './pages/NewPost';
import PostDetail from './pages/PostDetail';
import EditPost   from './pages/EditPost';

export default function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <NavBar />

        <Routes>
          <Route path="/"               element={<div className="card"><Home       /></div>} />
          <Route path="/login"          element={<div className="card"><Login      /></div>} />
          <Route path="/register"       element={<div className="card"><Register   /></div>} />
          <Route path="/posts/new"      element={<div className="card"><NewPost    /></div>} />
          <Route path="/posts/:id"      element={<div className="card"><PostDetail /></div>} />
          <Route path="/posts/:id/edit" element={<div className="card"><EditPost   /></div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

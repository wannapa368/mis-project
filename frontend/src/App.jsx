import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateQuestion from './pages/CreateQuestion';
import QuestionDetail from './pages/QuestionDetail';
import ChatSupport from './components/ChatSupport';

function App() {
  const [currentUser, setCurrentUser] = useState({
    name: 'Somchai R.',
    role: 'Student',
    avatar: 'Student'
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
        <Route path="/create" element={<CreateQuestion currentUser={currentUser} />} />
        <Route path="/question/:id" element={<QuestionDetail currentUser={currentUser} />} />
      </Routes>
      <ChatSupport />
    </BrowserRouter>
  );
}

export default App;
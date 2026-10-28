import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Hide from './hide.jsx'

const App = () => (
  <Routes>
    {/* Public Route */}
    <Route path="/" element={<Hide />} />

  </Routes>
);

export default App;

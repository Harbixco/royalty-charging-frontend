import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NewCharging from './pages/NewCharging.jsx';
import ChargingRecords from './pages/ChargingRecords.jsx';
import CustomerDetails from './pages/CustomerDetails.jsx';
import Pricing from './pages/Pricing.jsx';
import NotFound from './pages/NotFound.jsx';

const App = () => (
  <Routes>
    {/* Public Route */}
    <Route path="/login" element={<Login />} />

    {/* Protected Admin Routes */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/new"
      element={
        <ProtectedRoute>
          <NewCharging />
        </ProtectedRoute>
      }
    />
    <Route
      path="/records"
      element={
        <ProtectedRoute>
          <ChargingRecords />
        </ProtectedRoute>
      }
    />
    <Route
      path="/records/:id"
      element={
        <ProtectedRoute>
          <CustomerDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path="/pricing"
      element={
        <ProtectedRoute>
          <Pricing />
        </ProtectedRoute>
      }
    />

    {/* Catch All */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;

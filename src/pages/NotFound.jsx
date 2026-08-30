import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import Button from '../components/ui/Button.jsx';

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-4 text-center">
    <div className="rounded-full bg-core-100 p-4 text-core-700">
      <Zap size={28} />
    </div>
    <h1 className="font-display text-2xl font-semibold text-core-800">Page not found</h1>
    <p className="max-w-sm text-sm text-core-400">The page you're looking for doesn't exist or has moved.</p>
    <Link to="/">
      <Button>Back to dashboard</Button>
    </Link>
  </div>
);

export default NotFound;

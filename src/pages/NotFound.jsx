import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Home, ListChecks, PlusCircle } from 'lucide-react';
import Button from '../components/ui/Button.jsx';

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-4 text-center">
    <div className="rounded-full bg-core-100 p-4 text-core-700">
      <Zap size={32} />
    </div>
    <h1 className="font-display text-2xl font-bold text-core-800">404 - Page Not Found</h1>
    <p className="max-w-sm text-sm text-core-500">
      The link you followed may be broken, or the page may have been removed.
    </p>
    <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
      <Link to="/">
        <Button variant="accent" icon={Home} size="sm">
          Dashboard
        </Button>
      </Link>
      <Link to="/records">
        <Button variant="secondary" icon={ListChecks} size="sm">
          Records
        </Button>
      </Link>
      <Link to="/new">
        <Button variant="secondary" icon={PlusCircle} size="sm">
          New Charging
        </Button>
      </Link>
    </div>
  </div>
);

export default NotFound;

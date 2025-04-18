import { useState } from 'react';
import { Link } from 'wouter';
import { FlaskRound } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-primary-900/95 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-4 py-3">
        <Link href="/">
          <a className="flex items-center gap-2">
            <FlaskRound className="h-6 w-6 text-primary-500" />
            <h1 className="text-xl md:text-2xl font-heading font-bold">
              <span className="text-primary-500">Chem</span>Sim
            </h1>
          </a>
        </Link>
      </div>
    </header>
  );
};

export default Header;
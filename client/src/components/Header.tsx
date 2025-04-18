import { useState } from 'react';
import { Link } from 'wouter';
import { FlaskRound } from 'lucide-react';
import { ThemeToggle } from './ui/theme-toggle';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2">
            <FlaskRound className="h-6 w-6 text-primary" />
            <h1 className="text-xl md:text-2xl font-heading font-bold">
              <span className="text-primary">Kim</span>Sim
            </h1>
          </a>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
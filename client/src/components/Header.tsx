import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Search, Menu, FlaskRound, X } from 'lucide-react';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality would go here
    console.log('Searching for:', searchQuery);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary-900/95 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <a className="flex items-center gap-2">
              <FlaskRound className="h-6 w-6 text-primary-500" />
              <h1 className="text-xl md:text-2xl font-heading font-bold">
                <span className="text-primary-500">Chem</span>Sim
              </h1>
            </a>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <a className="text-white hover:text-primary-500 transition">Home</a>
          </Link>
          <Link href="/#simulations">
            <a className="text-white hover:text-primary-500 transition">Simulations</a>
          </Link>
          <Link href="/#about">
            <a className="text-white hover:text-primary-500 transition">About</a>
          </Link>
          <Link href="/#resources">
            <a className="text-white hover:text-primary-500 transition">Resources</a>
          </Link>
        </nav>
        
        <div className="flex items-center gap-3">
          {isSearchOpen ? (
            <form 
              onSubmit={handleSearch}
              className="relative md:block animate-in fade-in duration-200"
            >
              <Input
                type="text"
                placeholder="Search simulations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-primary-900 border border-gray-700 rounded-full py-1.5 pr-10 text-sm w-44 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full text-gray-400"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-gray-400 hover:text-white"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-primary-900 text-white">
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/">
                  <a className="text-lg hover:text-primary-500 transition">Home</a>
                </Link>
                <Link href="/#simulations">
                  <a className="text-lg hover:text-primary-500 transition">Simulations</a>
                </Link>
                <Link href="/#about">
                  <a className="text-lg hover:text-primary-500 transition">About</a>
                </Link>
                <Link href="/#resources">
                  <a className="text-lg hover:text-primary-500 transition">Resources</a>
                </Link>
                
                <form onSubmit={handleSearch} className="mt-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search simulations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded-md py-2 px-4 pr-10 text-sm w-full"
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full text-gray-400"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;

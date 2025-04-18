import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FlaskRound, Github, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FlaskRound className="h-5 w-5 text-primary-500" />
              <h3 className="text-xl font-heading font-bold text-white">
                <span className="text-primary-500">Chem</span>Sim
              </h3>
            </div>
            <p className="text-sm mb-4">
              Öğrenciler ve eğitimciler için interaktif kimya simülasyonları. Sanal deneylerle temel kavramları keşfedin.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Hızlı Bağlantılar</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-primary-500 transition">Ana Sayfa</a>
                </Link>
              </li>
              <li>
                <Link href="/#simulations">
                  <a className="text-gray-400 hover:text-primary-500 transition">Simülasyonlar</a>
                </Link>
              </li>
              <li>
                <Link href="/#about">
                  <a className="text-gray-400 hover:text-primary-500 transition">Hakkında</a>
                </Link>
              </li>
              <li>
                <Link href="/#resources">
                  <a className="text-gray-400 hover:text-primary-500 transition">Kaynaklar</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-400 hover:text-primary-500 transition">İletişim</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Güncellemelere Abone Ol</h4>
            <p className="text-sm mb-3">Yeni simülasyonlar eklediğimizde haberdar ol.</p>
            <form className="flex">
              <Input 
                type="email" 
                placeholder="E-posta adresiniz" 
                className="bg-gray-800 border border-gray-700 rounded-l-md py-2 px-3 text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
              <Button 
                type="submit" 
                className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-r-md text-sm font-medium"
              >
                Abone Ol
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} ChemSim. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Link } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { LuxuryButton } from '@/components/shared/LuxuryButton';
import { Input } from '@/components/ui/input';
import { usePlatformStore } from '@/stores/platformStore';

export function PublicFooter() {
  const { platformName, contactEmail, socialHandle } = usePlatformStore();
  return (
    <footer className="bg-nahkya-text text-nahkya-bg">
      <div className="max-w-container mx-auto pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
          <div>
            <Logo variant="light" size="sm" className="mb-4" />
            <p className="text-sm text-nahkya-bg font-body">A digital scarf atelier</p>
            <p className="font-mono text-mono-sm font-medium uppercase text-nahkya-bg mt-2">Brunei</p>
          </div>
          <div>
            <h4 className="font-mono text-mono-md font-medium uppercase text-nahkya-bg mb-6">Explore</h4>
            <ul className="space-y-3">
              {['The House', 'By Nahkya', 'The Silk Report', 'Herstory', 'Silk Wire', 'Membership'].map((l) => (
                <li key={l}>
                  <Link to={l === 'The House' ? '/' : `/${l.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-nahkya-bg hover:text-nahkya-bg transition-colors font-body">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-mono-md font-medium uppercase text-nahkya-bg mb-6">Atelier</h4>
            <ul className="space-y-3">
              {['Atelier Tool', 'Monogram Studio', 'Petak Composer', 'Saved Designs', 'My Orders'].map((l) => (
                <li key={l}>
                  <span className="text-sm text-nahkya-bg font-body cursor-default">{l}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-mono-md font-medium uppercase text-nahkya-bg mb-6">Connect</h4>
            <p className="text-sm text-nahkya-highlight font-body mb-2">{contactEmail}</p>
            <p className="text-sm text-nahkya-text-secondary font-body mb-6">{socialHandle}</p>
            <div>
              <p className="font-mono text-mono-sm font-medium uppercase text-nahkya-bg mb-2">The Silk Letter</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Your email"
                  className="bg-transparent border-nahkya-inverse/10 text-nahkya-bg placeholder:text-nahkya-bg text-sm h-9"
                />
                <LuxuryButton variant="dark-primary" size="sm">Join</LuxuryButton>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-nahkya-inverse/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-mono text-mono-sm font-medium uppercase text-nahkya-bg">&copy; {new Date().getFullYear()} {platformName}. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="font-mono text-mono-sm font-medium uppercase text-nahkya-bg hover:text-nahkya-bg transition-colors cursor-pointer">Privacy</span>
            <span className="font-mono text-mono-sm font-medium uppercase text-nahkya-bg hover:text-nahkya-bg transition-colors cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

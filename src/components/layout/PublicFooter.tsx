import { Link } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { LuxuryButton } from '@/components/shared/LuxuryButton';
import { Input } from '@/components/ui/input';
import { usePlatformStore } from '@/stores/platformStore';

const EXPLORE_LINKS = [
  { label: 'The House', href: '/' },
  { label: 'By Nahkya', href: '/by-nahkya' },
  { label: 'The Silk Report', href: '/silk-report' },
  { label: 'Herstory', href: '/herstory' },
  { label: 'Silk Wire', href: '/silk-wire' },
  { label: 'Membership', href: '/membership' },
];

const ATELIER_LINKS = [
  'Atelier Tool',
  'Monogram Studio',
  'Petak Composer',
  'Saved Designs',
  'My Orders',
];

export function PublicFooter() {
  const { platformName, contactEmail, socialHandle } = usePlatformStore();

  return (
    <footer className="bg-nahkya-text text-nahkya-bg">
      <div className="max-w-container mx-auto px-5 sm:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
          <div>
            <Logo variant="light" size="sm" className="mb-4" />
            <p className="text-body-sm text-nahkya-bg font-body">A digital scarf atelier</p>
            <p className="font-mono text-mono-sm font-medium uppercase text-nahkya-bg mt-2">Brunei</p>
          </div>

          <div>
            <h4 className="font-mono text-mono-md font-medium uppercase text-nahkya-bg mb-6">
              Explore
            </h4>
            <ul className="space-y-3">
              {EXPLORE_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="text-body-sm text-nahkya-bg hover:text-nahkya-highlight transition-colors font-body"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-mono-md font-medium uppercase text-nahkya-bg mb-6">
              Atelier
            </h4>
            <ul className="space-y-3">
              {ATELIER_LINKS.map((l) => (
                <li key={l}>
                  <span className="text-body-sm text-nahkya-bg font-body cursor-default">{l}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-mono-md font-medium uppercase text-nahkya-bg mb-6">
              Connect
            </h4>
            <p className="text-body-sm text-nahkya-highlight font-body mb-2">{contactEmail}</p>
            <p className="text-body-sm text-nahkya-text-secondary font-body mb-6">{socialHandle}</p>
            <div>
              <p className="font-mono text-mono-sm font-medium uppercase text-nahkya-bg mb-2">
                The Silk Letter
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Your email"
                  className="bg-transparent border-nahkya-inverse/10 text-nahkya-bg placeholder:text-nahkya-bg/60 text-body-sm h-9 rounded-nahkya focus-visible:ring-nahkya-highlight"
                />
                <LuxuryButton variant="dark-primary" size="sm">Join</LuxuryButton>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-nahkya-inverse/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-mono text-mono-sm font-medium uppercase text-nahkya-bg">
            &copy; {new Date().getFullYear()} {platformName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="font-mono text-mono-sm font-medium uppercase text-nahkya-bg hover:text-nahkya-highlight transition-colors cursor-pointer">
              Privacy
            </span>
            <span className="font-mono text-mono-sm font-medium uppercase text-nahkya-bg hover:text-nahkya-highlight transition-colors cursor-pointer">
              Terms
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

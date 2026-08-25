import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, Phone, Mail, LogIn, MessageCircle, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { siteInfo } from '../data';

interface NavLink {
  name: string;
  path: string;
  children?: { name: string; path: string }[];
}

const navLinks: NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  {
    name: 'Courses',
    path: '/courses',
    children: [
      { name: 'All Courses', path: '/courses' },
      { name: 'Certificate Courses', path: '/courses?category=Certificate' },
      { name: 'Diploma Courses', path: '/courses?category=Diploma' },
      { name: 'Skill Development (OKCL)', path: '/courses?category=Skill+Development' },
      { name: 'Accounting & Tally', path: '/courses?category=Accounting' },
      { name: 'Programming & DTP', path: '/courses?category=Programming+%26+DTP' }
    ]
  },
  { name: 'Affiliations', path: '/affiliations' },
  { name: 'Faculty', path: '/faculty' },
  { name: 'Admissions', path: '/admissions' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact Us', path: '/contact' }
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 120);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname, location.search]);

  const isActive = (path: string) => location.pathname === path.split('?')[0];

  return (
    <header className="relative z-50">
      {/* Utility bar - contact quick links */}
      <div className="hidden bg-primary-dark text-white lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            <a href={`tel:${siteInfo.contact.phone}`} className="flex items-center gap-1.5 hover:text-accent">
              <Phone size={13} /> {siteInfo.contact.phone}
            </a>
            <a href={`mailto:${siteInfo.contact.email}`} className="flex items-center gap-1.5 hover:text-accent">
              <Mail size={13} /> {siteInfo.contact.email}
            </a>
          </div>
          <div className="flex items-center gap-5">
            <a
              href={`https://wa.me/${siteInfo.contact.whatsapp.replace(/[^0-9]/g, '')}`}
              className="flex items-center gap-1.5 hover:text-accent"
            >
              <MessageCircle size={13} /> WhatsApp
            </a>
            <Link
              to="/login"
              className="flex items-center gap-1.5 border border-white/30 bg-white/10 px-3 py-1 font-semibold text-white transition-colors hover:bg-accent hover:border-accent hover:text-primary-dark"
            >
              <LogIn size={13} /> Student / Staff Login
            </Link>
          </div>
        </div>
      </div>

      {/* Logo band */}
      <div className="bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Vidya Educational Society logo"
              className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
            />
            <span className="flex flex-col leading-tight">
              <span className="font-heading text-base font-extrabold uppercase text-primary sm:text-xl">
                Vidya Educational Society <span className="text-accent">(NEURON)</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-accent sm:text-[11px]">
                NIOS · OKCL · ITCT Authorized Centre · Since {siteInfo.established}
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-3 lg:flex">
            <a href={`tel:${siteInfo.contact.phone}`} className="btn-primary px-5 py-2.5 text-xs">
              <Phone size={15} /> Call Now
            </a>
            <Link to="/contact" className="btn-accent px-5 py-2.5 text-xs">
              Admission Open
            </Link>
          </div>

          <button
            className="p-2 text-primary lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Main blue navigation - sticks to the top once scrolled past the logo band */}
      <nav
        className={cn(
          'hidden bg-primary lg:block',
          isScrolled && 'fixed top-0 right-0 left-0 shadow-lg'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => setOpenDropdown(link.children ? link.name : null)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                to={link.path}
                className={cn(
                  'flex items-center gap-1 border-r border-white/15 px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-primary-light',
                  isActive(link.path) && 'bg-accent hover:bg-accent'
                )}
              >
                {link.name}
                {link.children && <ChevronDown size={14} />}
              </Link>

              <AnimatePresence>
                {link.children && openDropdown === link.name && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-64 border-t-2 border-accent bg-white shadow-xl"
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.path}
                        className="block border-b border-slate-100 px-4 py-2.5 text-sm text-slate-700 transition-colors last:border-b-0 hover:bg-bg-alt hover:text-primary"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </nav>
      {/* Keeps layout height stable when the nav becomes fixed */}
      {isScrolled && <div className="hidden h-[50px] lg:block" />}

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-primary lg:hidden"
          >
            <div className="flex flex-col px-4 py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'border-b border-white/10 py-3 text-sm font-semibold uppercase tracking-wide text-white',
                    isActive(link.path) && 'text-accent'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href={`tel:${siteInfo.contact.phone}`}
                className="flex items-center gap-2 border-b border-white/10 py-3 text-sm font-semibold uppercase text-white"
              >
                <Phone size={15} /> {siteInfo.contact.phone}
              </a>
              <a
                href={`https://wa.me/${siteInfo.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                className="flex items-center gap-2 py-3 text-sm font-semibold uppercase text-white"
              >
                <MessageCircle size={15} /> WhatsApp Us
              </a>
              <Link
                to="/login"
                className="flex items-center gap-2 border-b border-white/10 py-3 text-sm font-semibold uppercase text-white"
              >
                <LogIn size={15} /> Student / Staff Login
              </Link>
              <Link to="/contact" className="btn-accent my-4 w-full">
                Admission Open - Apply Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

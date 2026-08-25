import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ChevronRight
} from 'lucide-react';
import { siteInfo } from '../data';

const usefulLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'All Courses', path: '/courses' },
  { name: 'Our Faculty', path: '/faculty' },
  { name: 'Affiliations', path: '/affiliations' },
  { name: 'Admissions', path: '/admissions' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Student / Staff Login', path: '/login' },
  { name: 'Contact Us', path: '/contact' }
];

const serviceLinks = [
  { name: 'Certificate Courses', path: '/courses?category=Certificate' },
  { name: 'Diploma Courses (PGDCA, DCA)', path: '/courses?category=Diploma' },
  { name: 'Skill Development (OKCL)', path: '/courses?category=Skill+Development' },
  { name: 'Tally Prime with GST', path: '/courses/tally-prime-gst' },
  { name: 'Programming & DTP', path: '/courses?category=Programming+%26+DTP' }
];

const socialLinks = [
  { name: 'Facebook', href: siteInfo.social.facebook, Icon: Facebook },
  { name: 'Twitter', href: siteInfo.social.twitter, Icon: Twitter },
  { name: 'Instagram', href: siteInfo.social.instagram, Icon: Instagram },
  { name: 'LinkedIn', href: siteInfo.social.linkedin, Icon: Linkedin },
  { name: 'YouTube', href: siteInfo.social.youtube, Icon: Youtube }
];

export function Footer() {
  return (
    <footer className="bg-dark text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Identity */}
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Vidya Educational Society logo"
              className="h-14 w-14 shrink-0 object-contain"
            />
            <span className="font-heading text-base font-bold uppercase text-white">
              Vidya Educational Society (NEURON)
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">{siteInfo.description}</p>
          <ul className="mt-4 space-y-1.5">
            {siteInfo.registrations.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
                <ChevronRight size={13} className="mt-0.5 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-2">
            {socialLinks.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                aria-label={name}
                className="flex h-9 w-9 items-center justify-center bg-white/10 text-white transition-colors hover:bg-accent"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Useful links */}
        <div>
          <h3 className="border-b border-white/15 pb-3 font-heading text-sm font-bold uppercase tracking-wide text-white">
            Useful Links
          </h3>
          <ul className="mt-4 space-y-2.5">
            {usefulLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="flex items-center gap-2 text-sm transition-colors hover:text-accent">
                  <ChevronRight size={14} className="text-accent" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Verification & login services */}
        <div>
          <h3 className="border-b border-white/15 pb-3 font-heading text-sm font-bold uppercase tracking-wide text-white">
            Popular Courses
          </h3>
          <ul className="mt-4 space-y-2.5">
            {serviceLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="flex items-center gap-2 text-sm transition-colors hover:text-accent">
                  <ChevronRight size={14} className="text-accent" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="border-b border-white/15 pb-3 font-heading text-sm font-bold uppercase tracking-wide text-white">
            Contact Us
          </h3>
          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0 text-accent" />
              <span>{siteInfo.contact.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone size={17} className="mt-0.5 shrink-0 text-accent" />
              <span className="flex flex-col">
                <a href={`tel:${siteInfo.contact.phone}`} className="hover:text-accent">
                  {siteInfo.contact.phone}
                </a>
                <a href={`tel:${siteInfo.contact.altPhone}`} className="hover:text-accent">
                  {siteInfo.contact.altPhone}
                </a>
                <a href={`tel:${siteInfo.contact.thirdPhone}`} className="hover:text-accent">
                  {siteInfo.contact.thirdPhone}
                </a>
                <span className="text-xs text-slate-400">WhatsApp: {siteInfo.contact.whatsapp}</span>
              </span>
            </li>
            <li className="flex gap-3">
              <Mail size={17} className="mt-0.5 shrink-0 text-accent" />
              <span className="flex flex-col break-all">
                <a href={`mailto:${siteInfo.contact.email}`} className="hover:text-accent">
                  {siteInfo.contact.email}
                </a>
                <a href={`mailto:${siteInfo.contact.admissionEmail}`} className="hover:text-accent">
                  {siteInfo.contact.admissionEmail}
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <Clock size={17} className="mt-0.5 shrink-0 text-accent" />
              <span>{siteInfo.contact.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/25">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-slate-400 sm:px-6 lg:flex-row lg:px-8">
          <p>
            © {new Date().getFullYear()} {siteInfo.name}. All Rights Reserved.
          </p>
          <p>NIOS · OKCL · ITCT Authorized Centre · Serving Keonjhar since {siteInfo.established}</p>
        </div>
      </div>
    </footer>
  );
}

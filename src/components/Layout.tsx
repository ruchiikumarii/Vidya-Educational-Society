import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { NoticeTicker } from './NoticeTicker';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { BackToTop } from './BackToTop';
import { VisitorCounter } from './VisitorCounter';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <NoticeTicker />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <VisitorCounter />
    </div>
  );
}

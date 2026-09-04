/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PageHeader } from './components/PageHeader';
import { AuthProvider } from './lib/auth';
import { Home } from './pages/Home';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { FacultyPage } from './pages/FacultyPage';
import { AffiliationsPage } from './pages/AffiliationsPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { GalleryPage } from './pages/GalleryPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/portal/LoginPage';
import { DashboardPage } from './pages/portal/DashboardPage';

function NotFoundPage() {
  return (
    <>
      <PageHeader title="Page Not Found" />
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="number-font font-heading text-6xl font-extrabold text-accent">404</p>
        <p className="mt-4 text-slate-600">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link to="/" className="btn-primary mt-8">
          Back to Home
        </Link>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:slug" element={<CourseDetailPage />} />
            <Route path="faculty" element={<FacultyPage />} />
            <Route path="affiliations" element={<AffiliationsPage />} />
            <Route path="admissions" element={<AdmissionsPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

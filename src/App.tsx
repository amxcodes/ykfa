import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import InstructorsPage from './pages/InstructorsPage';
import MembershipPage from './pages/MembershipPage';
import ContactPage from './pages/ContactPage';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Initialize animation observer
    const initializeObserver = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.1
        }
      );

      // Observe all elements with animate-fade-up class
      document.querySelectorAll('.animate-fade-up').forEach((element) => {
        // Remove any existing active class to reset animation
        element.classList.remove('active');
        observer.observe(element);
        
        // Add active class immediately if element is already in viewport
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          element.classList.add('active');
          observer.unobserve(element);
        }
      });

      return observer;
    };

    // Small delay to ensure DOM is updated after route change
    const timeoutId = setTimeout(() => {
      const observer = initializeObserver();
      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]); // Re-run when route changes

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="programs" element={<ProgramsPage />} />
        <Route path="instructors" element={<InstructorsPage />} />
        <Route path="membership" element={<MembershipPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
    </Routes>
  );
}

export default App;
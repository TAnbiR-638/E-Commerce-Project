import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Toast />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}

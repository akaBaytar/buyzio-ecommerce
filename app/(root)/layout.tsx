import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <main className='flex-1 wrapper mb-10'>{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;

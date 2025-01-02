import { APP_NAME } from '@/constants';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className='border-t border-input'>
      <div className='flex-center p-5 text-xs'>
        Copyright {year} &copy; {APP_NAME}. All right reserved.
      </div>
    </footer>
  );
};

export default Footer;

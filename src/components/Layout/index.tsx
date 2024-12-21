import { ThemeProvider } from 'next-themes';
import { LetterscapeAppWithProviders } from './provider';

const Layout = ({ children } : any) => {
  return (
    <div>
      <ThemeProvider enableSystem>
        <LetterscapeAppWithProviders>{children}</LetterscapeAppWithProviders>
      </ThemeProvider>
    </div>
  );
};

export default Layout;
import OrigDoc from '../../../components/kb/OrigDoc';
import '../../kb/orig/client-standards.css';
import bodyHtml from '../../kb/orig/client-standards.body.html?raw';
import '../orig/kb-override.css';
import scriptJs from '../../kb/orig/client-standards.js?raw';

export default function ClientCompanyStandards({ theme = 'dark', onThemeChange }) {
  return (
    <OrigDoc
      docId="client-standards"
      bodyHtml={bodyHtml}
      scriptJs={scriptJs}
      themeKeys={['dekode-client-theme']}
      theme={theme}
      onThemeChange={onThemeChange}
    />
  );
}

import OrigDoc from '../../../components/kb/OrigDoc';
import '../../kb/orig/internal-standards.css';
import bodyHtml from '../../kb/orig/internal-standards.body.html?raw';
import '../orig/kb-override.css';
import scriptJs from '../../kb/orig/internal-standards.js?raw';

export default function InternalCompanyStandards({ theme = 'dark', onThemeChange }) {
  return (
    <OrigDoc
      docId="internal-standards"
      bodyHtml={bodyHtml}
      scriptJs={scriptJs}
      themeKeys={['company_handbook_theme']}
      theme={theme}
      onThemeChange={onThemeChange}
    />
  );
}

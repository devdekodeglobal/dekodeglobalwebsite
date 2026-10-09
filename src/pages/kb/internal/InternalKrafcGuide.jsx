import OrigDoc from '../../../components/kb/OrigDoc';
import '../../kb/orig/internal-krafc.css';
import bodyHtml from '../../kb/orig/internal-krafc.body.html?raw';
import '../orig/kb-override.css';
import scriptJs from '../../kb/orig/internal-krafc.js?raw';

export default function InternalKrafcGuide({ theme = 'dark', onThemeChange }) {
  return (
    <OrigDoc
      docId="internal-krafc"
      bodyHtml={bodyHtml}
      scriptJs={scriptJs}
      themeKeys={['krafc-theme']}
      theme={theme}
      onThemeChange={onThemeChange}
    />
  );
}

import OrigDoc from '../../../components/kb/OrigDoc';
import '../../kb/orig/client-krafc.css';
import bodyHtml from '../../kb/orig/client-krafc.body.html?raw';
import '../orig/kb-override.css';
import scriptJs from '../../kb/orig/client-krafc.js?raw';

export default function ClientKrafcGuide({ theme = 'dark', onThemeChange }) {
  return (
    <OrigDoc
      docId="client-krafc"
      bodyHtml={bodyHtml}
      scriptJs={scriptJs}
      themeKeys={['krafc-client-theme']}
      theme={theme}
      onThemeChange={onThemeChange}
    />
  );
}

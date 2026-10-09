import OrigDoc from '../../../components/kb/OrigDoc';
import '../../kb/orig/client-optiflow.css';
import bodyHtml from '../../kb/orig/client-optiflow.body.html?raw';
import '../orig/kb-override.css';
import scriptJs from '../../kb/orig/client-optiflow.js?raw';

export default function ClientOptiFlowGuide({ theme = 'dark', onThemeChange }) {
  return (
    <OrigDoc
      docId="client-optiflow"
      bodyHtml={bodyHtml}
      scriptJs={scriptJs}
      themeKeys={['optiflow-client-theme']}
      theme={theme}
      onThemeChange={onThemeChange}
    />
  );
}

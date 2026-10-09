import OrigDoc from '../../../components/kb/OrigDoc';
import '../../kb/orig/internal-optiflow.css';
import bodyHtml from '../../kb/orig/internal-optiflow.body.html?raw';
import '../orig/kb-override.css';
import scriptJs from '../../kb/orig/internal-optiflow.js?raw';

export default function InternalOptiFlowGuide({ theme = 'dark', onThemeChange }) {
  return (
    <OrigDoc
      docId="internal-optiflow"
      bodyHtml={bodyHtml}
      scriptJs={scriptJs}
      themeKeys={['optiflow_guide_theme']}
      theme={theme}
      onThemeChange={onThemeChange}
    />
  );
}

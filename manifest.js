import packageJson from './package.json' assert { type: 'json' };

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
  manifest_version: 3,
  name: 'Tab Search',
  version: packageJson.version,
  description: packageJson.description,
  permissions: ['tabs'],
  action: {
    default_popup: 'src/pages/popup/index.html',
    default_icon: 'icon-32.png',
  },
  commands: {
    _execute_action: {
      suggested_key: {
        default: 'Command+MacCtrl+T',
      },
      description: 'Toggle extension popup',
    },
  },
  icons: {
    16: 'icon-16.png',
    32: 'icon-32.png',
  },
  web_accessible_resources: [
    {
      resources: ['assets/js/*.js', 'assets/css/*.css', 'icon-16.png', 'icon-32.png'],
      matches: ['*://*/*'],
    },
  ],
};

export default manifest;

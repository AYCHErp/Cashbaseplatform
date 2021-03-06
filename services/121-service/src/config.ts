import { TWILIO } from './secrets';

export const PORT = 3000;
export const DEBUG =
  ['production', 'staging'].indexOf(process.env.NODE_ENV) > -1
    ? false
    : true;
export const SUBDOMAIN =
  ['production', 'staging'].indexOf(process.env.NODE_ENV) > -1
    ? '121-service/'
    : '';
export const SCHEME =
  ['production', 'staging'].indexOf(process.env.NODE_ENV) > -1
    ? 'https'
    : 'http';

const tyknIMS = 'http://11.0.0.3:50001/api/';
const orgIMS = 'http://11.0.0.4:50002/api/';
const fsp1 = 'https://postman-echo.com/';
const fsp2 = 'https://postman-echo.com/';
const fsp3 = 'https://postman-echo.com/';
const fsp4 = 'https://postman-echo.com/';

export const PRODUCTION_URL = 'https://production-vm.121.global/121-service/';
export const STAGING_URL = 'https://test-vm.121.global/121-service/';

export const API = {
  schema: tyknIMS + 'schema',
  credential: {
    definition: orgIMS + 'credential/definition',
    credoffer: orgIMS + 'credential/credoffer',
    issue: orgIMS + 'credential/issue',
  },
  proof: {
    verify: orgIMS + 'proof/verify',
  },
  fsp: [
    {
      payout: fsp1 + 'post',
      name: 'Bank A',
    },
    {
      payout: fsp2 + 'post',
      name: 'Mobile Money Provider B',
    },
    {
      payout: fsp3 + 'post',
      name: 'FSP C - mixed attributes',
    },
    {
      payout: fsp4 + 'post',
      name: 'FSP D - no attributes',
    },
  ],
};

let appUrl: string;
if (process.env.NODE_ENV == 'production') {
  appUrl = PRODUCTION_URL;
} else if (process.env.NODE_ENV == 'staging') {
  appUrl = STAGING_URL;
} else {
  appUrl = TWILIO.ngrok;
}
export default appUrl;
export const TWILIO_API = {
  callbackUrlSms: appUrl + 'api/notifications/sms/status',
  callbackUrlVoice: appUrl + 'api/notifications/voice/status',
  voiceXmlUrl: appUrl + 'api/notifications/voice/xml/',
  voiceMp3lUrl: appUrl + 'api/notifications/voice/mp3/',
};

import { join } from "path";
import { IConfiguration, IUrl } from "src/shared/interface/configuration.interface";

export default () => {
  const dev: IConfiguration = {
    app: {
      port: Number(process.env.DEV_APP_PORT) || 3004
    },
    db: {
      protocol: process.env.DEV_DB_PROTOCOL || 'mongodb',
      host: process.env.DEV_DB_HOST || 'localhost',
      port: Number(process.env.DEV_DB_PORT) || 27017,
      path: process.env.DEV_DB_NAME || 'pos_dev'
    },
    printer: {
      protocol: process.env.DEV_PRINTER_PROTOCOL || 'http',
      host: process.env.DEV_PRINTER_HOST || 'localhost',
      port: Number(process.env.DEV_PRINTER_PORT) || 3005
    },
    client: {
      protocol: process.env.DEV_CLIENT_PROTOCOL || 'http',
      host: process.env.DEV_CLIENT_HOST || 'localhost',
      port: Number(process.env.DEV_CLIENT_PORT) || 4200
    }
  };

  const pro: IConfiguration = {
    app: {
      port: Number(process.env.PRO_APP_PORT)
    },
    db: {
      protocol: process.env.PRO_DB_PROTOCOL || 'mongodb',
      host: process.env.PRO_DB_HOST,
      port: Number(process.env.PRO_DB_PORT),
      path: process.env.PRO_DB_NAME
    },
    printer: {
      protocol: process.env.PRO_PRINTER_PROTOCOL || 'http',
      host: process.env.PRO_PRINTER_HOST || 'localhost',
      port: Number(process.env.PRO_PRINTER_PORT) || 3005
    },
    client: {
      protocol: process.env.PRO_CLIENT_PROTOCOL || 'http',
      host: process.env.PRO_CLIENT_HOST || 'localhost',
      port: Number(process.env.PRO_CLIENT_PORT) || 4200
    }
  };

  const folder = {
    uploads: join(process.cwd(), process.env.UPLOAD_FOLDER).replace(/\\/g, "/")
  }

  const vnPublicApi: IUrl = {
    protocol: process.env.VN_PUBLIC_API_PROTOCOL || 'https',
    host: process.env.VN_PUBLIC_API_HOST || 'vn-public-apis.fpo.vn',
    port: Number(process.env.VN_PUBLIC_API_PORT) || 443,
  }

  const authenticationProvider = {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    },
    facebook: {
      appId: process.env.FACEBOOK_APP_ID || '',
      appSecret: process.env.FACEBOOK_APP_SECRET || ''
    }
  }

  const jwt = {
    accessToken: {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_LIFE
    },
    refreshToken: {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_LIFE
    }
  }

  const config = process.env.NODE_ENV?.trim() === 'pro' ? pro : dev;

  return { ...config, folder, vnPublicApi, authenticationProvider, jwt };
}
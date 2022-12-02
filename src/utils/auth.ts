import jwt from 'jsonwebtoken';
import { EXP_ACCESSJWT } from '../config/auth';
import { extractURLDomain } from './general';
import { COOKIE_KEY, CORS_ORIGINS } from './secrets';

// Function for generating jwt tokens
export const generateJwt = (user: any) => {
  const token = jwt.sign(user, COOKIE_KEY, {
    expiresIn: EXP_ACCESSJWT,
  });
  return token;
};

/**
 * Possible handled cases:
 *  relative path -> Eg. /homepage : automatically get the base url from referer (support by all browser)
 *  absolute path -> Eg. https://domain.com/homepage : checks if the domain is valid
 */
export const handleRedirectUrl = (queryReturnUrl: string | undefined, referer: string | undefined) => {
  var redirectUrl = referer || CORS_ORIGINS[0];

  if (redirectUrl.endsWith("/")) redirectUrl.slice(-1);
  
  if (queryReturnUrl) {
    if (queryReturnUrl.startsWith("/")) return redirectUrl + queryReturnUrl;
    if (CORS_ORIGINS !== "*" ) {
      const check = CORS_ORIGINS.find(url => extractURLDomain(url) === extractURLDomain(queryReturnUrl))
      if (check) return queryReturnUrl;
    }
  }

  return redirectUrl;
}
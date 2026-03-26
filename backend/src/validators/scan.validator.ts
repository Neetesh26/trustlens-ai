import { body } from 'express-validator';

export const scanValidator = [
  body('url')
    .trim()
    .notEmpty().withMessage('URL is required')
    .isURL({ require_protocol: true }).withMessage('Must be a valid URL with http:// or https://')
    .customSanitizer((value: string) => {
      // Block local/private IPs (SSRF protection)
      const blocked = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
      const hostname = new URL(value).hostname;
      if (blocked.some((b) => hostname.includes(b))) {
        throw new Error('Scanning local/private addresses is not allowed');
      }
      return value;
    }),
];
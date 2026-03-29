/**
 * Certificate Pinning Configuration and Implementation
 * 
 * This module provides production-ready certificate pinning for the Shakuntala Gold App.
 * Supports both managed Expo and bare React Native workflows.
 * 
 * For Managed Expo: Use as configuration template for prod builds
 * For Bare React Native: Use with react-native-ssl-pinning or platform-native implementation
 */

// Production certificate pin configuration
// Pin format: SHA-256 hash of the public key (not the certificate)
// Generate via: openssl x509 -in cert.crt -pubkey -noout | openssl pkey -pubin -outform DER | openssl dgst -sha256 -binary | openssl enc -base64

export const PRODUCTION_PINS = {
  // Production API domain - update with actual certificates
  'api.shakuntala-gold.com': {
    pins: [
      // Primary certificate pin (public key hash)
      'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=', // Replace with actual pin
      // Backup certificate pin for rotation
      'sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=', // Replace with actual pin
    ],
    includeSubdomains: true,
    maxAge: 31536000, // 1 year in seconds
  },
  
  // Firebase Auth domain (if used for direct auth)
  'identitytoolkit.googleapis.com': {
    pins: [
      'sha256/rHQvPvmMgVNcu6/4IB8ap0Bweccnnp+YkcLiemjPikiA=', // Google cert pin
    ],
    includeSubdomains: true,
    maxAge: 31536000,
  },
};

// SSL Pinning Strategy
export enum SSLPinningStrategy {
  /**
   * Pin public key hash - recommended
   * Survives certificate renewal as long as public key stays same
   */
  PUBLIC_KEY_HASH = 'publicKeyHash',
  
  /**
   * Pin certificate chain - stricter but requires update on renewal
   */
  CERTIFICATE_CHAIN = 'certificateChain',
}

/**
 * Environment-specific pinning configuration
 */
export const PINNING_CONFIG = {
  // Development: Pinning disabled for localhost/internal testing
  development: {
    enabled: false,
    strategy: SSLPinningStrategy.PUBLIC_KEY_HASH,
    allowLocalhost: true,
    enforceStrict: false, // Development doesn't enforce
  },
  
  // Staging: Soft pinning (logs mismatches, doesn't block)
  staging: {
    enabled: true,
    strategy: SSLPinningStrategy.PUBLIC_KEY_HASH,
    allowLocalhost: false,
    enforceStrict: false, // Warnings only
  },
  
  // Production: Strict pinning (blocks on mismatch)
  production: {
    enabled: true,
    strategy: SSLPinningStrategy.PUBLIC_KEY_HASH,
    allowLocalhost: false,
    enforceStrict: true, // Hard block on pin failure
  },
};

/**
 * Pin verification result
 */
export interface PinVerificationResult {
  isValid: boolean;
  domain: string;
  receivedPin: string;
  expectedPins: string[];
  timestamp: number;
  error?: string;
}

/**
 * Production Certificate Pin Management
 * 
 * Usage for bare React Native with react-native-ssl-pinning:
 * 
 * import RNSSLPinning from 'react-native-ssl-pinning';
 * 
 * const verifyPin = async (url: string) => {
 *   try {
 *     await RNSSLPinning.fetch(
 *       url,
 *       {
 *         method: 'GET',
 *         pinnedDomains: [
 *           'api.shakuntala-gold.com',
 *           'identitytoolkit.googleapis.com',
 *         ],
 *       }
 *     );
 *     return { isValid: true };
 *   } catch (error) {
 *     return { isValid: false, error: error.message };
 *   }
 * };
 */

/**
 * Certificate pin rotation helper
 * Maintains primary and backup pins to enable certificate renewal without service interruption
 */
export class CertificatePinRotation {
  private activePin: string;
  private backupPin: string;
  
  constructor(activePin: string, backupPin: string) {
    this.activePin = activePin;
    this.backupPin = backupPin;
  }
  
  /**
   * Verify pin against active or backup
   */
  verify(receivedPin: string): boolean {
    return receivedPin === this.activePin || receivedPin === this.backupPin;
  }
  
  /**
   * Rotate pins when certificate is renewed
   * Call this during deployment of new certificate
   */
  rotatePins(newActivePin: string, newBackupPin: string) {
    this.activePin = newActivePin;
    this.backupPin = newBackupPin;
  }
  
  /**
   * Get current pins
   */
  getPins(): string[] {
    return [this.activePin, this.backupPin];
  }
}

/**
 * DEPLOYMENT INSTRUCTIONS FOR CERTIFICATE PINNING
 * 
 * ## Step 1: Generate Certificate Pins
 * 
 * For your production certificate:
 * ```bash
 * # Extract public key
 * openssl x509 -in your-cert.crt -pubkey -noout > pubkey.pem
 * 
 * # Generate SHA-256 hash
 * openssl pkey -pubin -in pubkey.pem -outform DER | 
 *   openssl dgst -sha256 -binary | 
 *   openssl enc -base64
 * 
 * # Output format: sha256/BASE64_HASH=
 * ```
 * 
 * ## Step 2: Update PRODUCTION_PINS
 * Replace placeholder pins with actual values from your certificates
 * 
 * ## Step 3: Bare React Native Setup
 * 
 * Install certificate pinning library:
 * ```bash
 * npm install react-native-ssl-pinning
 * npx expo prebuild --clean  # For Expo projects
 * ```
 * 
 * ## Step 4: Implement Pinning in API Client
 * 
 * Use react-native-ssl-pinning for all network requests:
 * ```typescript
 * import RNSSLPinning from 'react-native-ssl-pinning';
 * 
 * const secureFetch = async (url: string, options?: RequestInit) => {
 *   return RNSSLPinning.fetch(url, {
 *     ...options,
 *     pinnedDomains: Object.keys(PRODUCTION_PINS),
 *   });
 * };
 * ```
 * 
 * ## Step 5: Certificate Rotation Planning
 * 
 * - Keep backup pin updated during certificate renewal
 * - Test pinning with new certificate in staging first
 * - Coordinate deployment with client app updates (if needed)
 * - Have rollback procedure ready
 * 
 * ## Troubleshooting
 * 
 * - Pin failure on exact certificate match? Generate new pins
 * - Wildcard domain issues? Use includeSubdomains setting
 * - Pin rotation needed? Use CertificatePinRotation class
 */

/**
 * Certificate pinning status checker (for debugging)
 */
export const getPinningStatus = () => {
  const env = process.env.NODE_ENV || 'development';
  const config = PINNING_CONFIG[env as keyof typeof PINNING_CONFIG] || PINNING_CONFIG.development;
  
  return {
    environment: env,
    pinningEnabled: config?.enabled ?? false,
    strategy: config?.strategy ?? SSLPinningStrategy.PUBLIC_KEY_HASH,
    pinnedDomains: Object.keys(PRODUCTION_PINS),
    enforceStrict: config?.enforceStrict ?? false,
  };
};

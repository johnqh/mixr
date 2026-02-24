import { MixrClient } from '@sudobility/mixr_client';
import { FirebaseAuthNetworkService } from '@sudobility/auth_lib';

/** Base URL for the MIXR API, sourced from environment or defaulting to local dev port. */
const baseUrl = import.meta.env.VITE_MIXR_API_URL || 'http://localhost:6174';

/**
 * Singleton MixrClient instance used by all app-level hooks.
 *
 * Uses {@link FirebaseAuthNetworkService} as its network layer, which
 * automatically injects the current user's Firebase ID token into every
 * outgoing API request as a Bearer token. This means all API calls made
 * through this client are authenticated transparently -- no manual token
 * management is required by consumers.
 */
export const mixrClient = new MixrClient(baseUrl, new FirebaseAuthNetworkService());

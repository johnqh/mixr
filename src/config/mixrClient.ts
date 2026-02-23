import { MixrClient } from '@sudobility/mixr_client';
import { FirebaseAuthNetworkService } from '@sudobility/auth_lib';

const baseUrl = import.meta.env.VITE_MIXR_API_URL || 'http://localhost:3000';

/**
 * Singleton MixrClient instance
 * Uses authenticated network client to add Firebase tokens to all requests
 */
export const mixrClient = new MixrClient(baseUrl, new FirebaseAuthNetworkService());

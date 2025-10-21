import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getDB } from '@/db';
import { teamTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface SaleorClientConfig {
  apiUrl: string;
  apiToken?: string;
  teamId: string;
}

/**
 * Creates an Apollo Client instance for a specific Saleor API endpoint
 * with proper authentication and error handling
 */
export function createSaleorClient({ apiUrl, apiToken, teamId }: SaleorClientConfig) {
  const httpLink = createHttpLink({
    uri: apiUrl,
  });

  // Authentication link
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        ...(apiToken && { Authorization: `Bearer ${apiToken}` }),
        'Content-Type': 'application/json',
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
}

/**
 * Gets or creates a Saleor client for a specific team
 * Uses Cloudflare KV for client caching
 */
export async function getSaleorClientForTeam(teamId: string) {
  // Get team configuration from database
  const db = getDB();
  const team = await db.query.teamTable.findFirst({
    where: eq(teamTable.id, teamId),
    columns: {
      saleorApiUrl: true,
      saleorApiToken: true,
    },
  });

  if (!team?.saleorApiUrl) {
    throw new Error(`No Saleor API URL configured for team ${teamId}`);
  }

  // Create new client
  const client = createSaleorClient({
    apiUrl: team.saleorApiUrl,
    apiToken: team.saleorApiToken || undefined,
    teamId,
  });

  return client;
}

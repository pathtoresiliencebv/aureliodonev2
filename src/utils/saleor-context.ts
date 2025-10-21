import "server-only";
import { getDB } from "@/db";
import { teamTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSaleorClient } from "@/lib/saleor/client";
import { withKVCache } from "@/utils/with-kv-cache";

/**
 * Gets a Saleor client for a specific team with caching
 * Uses KV cache to avoid recreating clients for the same team
 */
export async function getSaleorClientForTeam(teamId: string) {
  return withKVCache(
    async () => {
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
      return createSaleorClient({
        apiUrl: team.saleorApiUrl,
        apiToken: team.saleorApiToken || undefined,
        teamId,
      });
    },
    {
      key: `saleor_client_${teamId}`,
      ttl: 3600, // 1 hour cache
    }
  );
}

/**
 * Gets team's Saleor configuration
 */
export async function getTeamSaleorConfig(teamId: string) {
  return withKVCache(
    async () => {
      const db = getDB();
      const team = await db.query.teamTable.findFirst({
        where: eq(teamTable.id, teamId),
        columns: {
          saleorApiUrl: true,
          saleorApiToken: true,
          storeDomain: true,
          storeStatus: true,
        },
      });

      if (!team) {
        throw new Error(`Team ${teamId} not found`);
      }

      return {
        apiUrl: team.saleorApiUrl,
        apiToken: team.saleorApiToken,
        domain: team.storeDomain,
        status: team.storeStatus,
      };
    },
    {
      key: `saleor_config_${teamId}`,
      ttl: 1800, // 30 minutes cache
    }
  );
}

/**
 * Updates team's Saleor configuration
 */
export async function updateTeamSaleorConfig(
  teamId: string,
  config: {
    saleorApiUrl?: string;
    saleorApiToken?: string;
    storeDomain?: string;
    storeStatus?: 'active' | 'inactive' | 'suspended';
  }
) {
  const db = getDB();

  await db.update(teamTable)
    .set(config)
    .where(eq(teamTable.id, teamId));

  // Clear cache
  const { env } = getCloudflareContext();
  await env.NEXT_INC_CACHE_KV.delete(`saleor_client_${teamId}`);
  await env.NEXT_INC_CACHE_KV.delete(`saleor_config_${teamId}`);
}

/**
 * Validates Saleor API connection
 */
export async function validateSaleorConnection(apiUrl: string, apiToken?: string) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiToken && { Authorization: `Bearer ${apiToken}` }),
      },
      body: JSON.stringify({
        query: `
          query {
            shop {
              name
              description
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GraphQL errors: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
    }

    return {
      success: true,
      shop: data.data?.shop,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Import required dependencies
import { getCloudflareContext } from '@/utils/get-cloudflare-context';

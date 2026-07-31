export default async function handler(req: any, res: any) {
  const keys = Object.keys(process.env).sort();
  const flags: Record<string, unknown> = {};
  const names: Record<string, unknown> = {};

  for (const k of keys) {
    const v = process.env[k] || "";
    flags[k + "_PRESENT"] = v.length > 0;
    names[k + "_LENGTH"] = v.length;
    // Only expose the value for a small allowlist of safe vars
    if (["NHOST_SUBDOMAIN", "NHOST_REGION", "NHOST_GRAPHQL_URL", "NHOST_HASURA_URL", "NHOST_AUTH_URL", "NODE_ENV", "FUNCTIONS_PATH"].includes(k)) {
      names[k + "_VALUE"] = v;
    }
  }

  const debugInfo: Record<string, unknown> = {
    moduleLoadTime: new Date().toISOString(),
    nodeVersion: process.version,
    totalEnvKeys: keys.length,
    allEnvKeys: keys,
    flags,
    names,
  };

  console.log("[DEBUG-ENV] keys:", JSON.stringify(keys));
  return res.json(debugInfo);
}

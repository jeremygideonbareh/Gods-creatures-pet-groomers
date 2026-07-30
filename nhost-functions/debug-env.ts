const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

export default async function handler(req: any, res: any) {
  const debugInfo: Record<string, unknown> = {
    moduleLoadTime: new Date().toISOString(),
    env: {
      CASHFREE_APP_ID_PRESENT: !!CASHFREE_APP_ID,
      CASHFREE_APP_ID_LENGTH: CASHFREE_APP_ID?.length ?? 0,
      CASHFREE_APP_ID_PREFIX: CASHFREE_APP_ID ? CASHFREE_APP_ID.substring(0, 25) : "NOT SET",
      CASHFREE_APP_ID_SUFFIX: CASHFREE_APP_ID ? CASHFREE_APP_ID.slice(-10) : "NOT SET",
      CASHFREE_SECRET_KEY_PRESENT: !!CASHFREE_SECRET_KEY,
      CASHFREE_SECRET_KEY_LENGTH: CASHFREE_SECRET_KEY?.length ?? 0,
      CASHFREE_SECRET_KEY_PREFIX: CASHFREE_SECRET_KEY ? CASHFREE_SECRET_KEY.substring(0, 25) : "NOT SET",
      CASHFREE_SECRET_KEY_SUFFIX: CASHFREE_SECRET_KEY ? CASHFREE_SECRET_KEY.slice(-10) : "NOT SET",
    },
    nodeVersion: process.version,
    allEnvKeys: Object.keys(process.env).filter(k => !k.includes("SECRET") && !k.includes("SECRET") && !k.includes("PASSWORD") && !k.includes("TOKEN")),
  };

  console.log("[DEBUG-ENV] Function invoked. Env vars:", JSON.stringify(debugInfo.env));

  return res.json(debugInfo);
}

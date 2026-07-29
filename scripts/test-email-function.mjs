#!/usr/bin/env node

/**
 * Test script for send-booking-receipt function
 * Run: node scripts/test-email-function.mjs
 *
 * Environment variables:
 *   TEST_FUNCTION_URL  — URL of the deployed function (optional)
 *   RESEND_API_KEY     — Resend API key for direct test (optional)
 */

const DEFAULT_FUNCTION_URL =
  "https://ukuqslqvwovrukooziwf.functions.ap-south-1.nhost.run/v1/send-booking-receipt";

const TEST_FUNCTION_URL = process.env.TEST_FUNCTION_URL || DEFAULT_FUNCTION_URL;

const testPayload = {
  event: {
    data: {
      new: {
        customer_name: "Test User",
        email: "test@example.com",
        service: "Full Groom - Small (Up to 10kg)",
        preferred_date: "2026-07-15",
        total_price: 2900,
        addons: ["Teeth Cleaning", "Flea & Tick Removal Treatment"],
        transaction_id: `TEST-${Date.now()}`,
        advance_paid: 500,
      },
    },
  },
};

async function testEmailFunction() {
  console.log("=".repeat(60));
  console.log("  send-booking-receipt Function Test");
  console.log("=".repeat(60));
  console.log("");
  console.log("URL:", TEST_FUNCTION_URL);
  console.log("");
  console.log("Request payload:");
  console.log(JSON.stringify(testPayload, null, 2));
  console.log("");

  try {
    const response = await fetch(TEST_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload),
    });

    const result = await response.json();
    console.log("Response status:", response.status);
    console.log("Response body:", JSON.stringify(result, null, 2));
    console.log("");

    if (response.ok && result.message === "Email sent") {
      console.log("✅ Email function test PASSED");
      console.log(`   Email ID: ${result.id}`);
      process.exit(0);
    } else {
      console.log("❌ Email function test FAILED");
      console.log(`   Reason: ${result.error || result.message || "Unknown error"}`);
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Email function test FAILED with error:");
    console.error(`   ${err.message}`);
    console.error("");
    console.error("   Possible causes:");
    console.error("   - Nhost function not deployed (push to GitHub first)");
    console.error("   - Wrong function URL");
    console.error("   - Network connectivity issue");
    process.exit(1);
  }
}

testEmailFunction();

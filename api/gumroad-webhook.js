/**
 * Auterix Pro — Gumroad Webhook Handler
 *
 * Automatically invites Gumroad buyers to the private GitHub repository (auterix-pro)
 * using their provided GitHub username from the Gumroad checkout custom field.
 */

export default async function handler(req, res) {
  // Health check on GET
  if (req.method === "GET") {
    return res.status(200).json({
      status: "active",
      service: "Auterix Pro Gumroad Webhook",
      timestamp: new Date().toISOString(),
      configured: Boolean(process.env.GITHUB_INVITE_TOKEN),
      repository: `${process.env.GITHUB_REPO_OWNER || "SapanMozammel"}/${process.env.GITHUB_REPO_NAME || "auterix-pro"}`,
    });
  }

  // Only accept POST requests for webhook events
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed. Send POST." });
  }

  try {
    // 1. Optional Secret Verification
    // Gumroad Ping URL can be configured with query params:
    // https://auterix.vercel.app/api/gumroad-webhook?secret=YOUR_SECRET
    const webhookSecret = process.env.GUMROAD_WEBHOOK_SECRET;
    const querySecret = req.query?.secret;

    if (webhookSecret && querySecret !== webhookSecret) {
      console.warn("[Webhook] Unauthorized webhook attempt: secret mismatch");
      return res.status(401).json({ error: "Invalid webhook secret" });
    }

    // 2. Parse Body (supports both application/x-www-form-urlencoded and application/json)
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        const params = new URLSearchParams(body);
        body = Object.fromEntries(params.entries());
      }
    }

    if (!body || typeof body !== "object") {
      return res.status(400).json({ error: "Empty or invalid payload" });
    }

    const {
      product_permalink,
      email,
      price,
      refunded,
      disputed,
      custom_fields,
    } = body;

    console.log(`[Webhook] Received ping for ${product_permalink || "auterix"} from ${email || "unknown email"}`);

    // Check if refunded or disputed
    const isRefunded = refunded === true || refunded === "true";
    const isDisputed = disputed === true || disputed === "true";

    if (isRefunded || isDisputed) {
      console.log(`[Webhook] Order for ${email} was refunded or disputed. Skipping invite.`);
      return res.status(200).json({ status: "skipped", reason: "refunded_or_disputed" });
    }

    // 3. Extract GitHub Username
    // Gumroad custom fields can appear as:
    // body.custom_fields["GitHub Username"]
    // body["custom_fields[GitHub Username]"]
    // body.github_username
    let rawGithubUser = "";

    if (custom_fields && typeof custom_fields === "object") {
      rawGithubUser =
        custom_fields["GitHub Username"] ||
        custom_fields["github username"] ||
        custom_fields["github"] ||
        custom_fields["GitHub"] ||
        "";
    }

    if (!rawGithubUser) {
      for (const [key, value] of Object.entries(body)) {
        if (key.toLowerCase().includes("github") && typeof value === "string") {
          rawGithubUser = value;
          break;
        }
      }
    }

    if (!rawGithubUser) {
      console.warn(`[Webhook] No GitHub username found in custom fields for ${email}`);
      return res.status(200).json({
        status: "success",
        warning: "No GitHub username supplied at checkout. Manual invitation required.",
        buyer_email: email,
      });
    }

    // 4. Sanitize GitHub Username
    const cleanUsername = rawGithubUser
      .trim()
      .replace(/^@+/, "")
      .replace(/^https?:\/\/github\.com\//i, "")
      .replace(/\/+$/, "");

    // Validate standard GitHub username format (1-39 alphanumeric chars, single hyphens inside)
    const githubRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
    if (!githubRegex.test(cleanUsername)) {
      console.warn(`[Webhook] Invalid GitHub username format: "${cleanUsername}" from ${email}`);
      return res.status(200).json({
        status: "success",
        warning: `Invalid GitHub username "${cleanUsername}". Manual invitation required.`,
        buyer_email: email,
      });
    }

    // 5. GitHub API Invitation
    const githubToken = process.env.GITHUB_INVITE_TOKEN;
    const repoOwner = process.env.GITHUB_REPO_OWNER || "SapanMozammel";
    const repoName = process.env.GITHUB_REPO_NAME || "auterix-pro";

    if (!githubToken) {
      console.error("[Webhook] GITHUB_INVITE_TOKEN environment variable is not configured in Vercel!");
      return res.status(200).json({
        status: "pending_config",
        message: "Sale recorded, but GITHUB_INVITE_TOKEN is not set in environment variables.",
        buyer_email: email,
        github_username: cleanUsername,
      });
    }

    // Invite user as collaborator with 'pull' (read) permission
    const inviteUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/collaborators/${encodeURIComponent(cleanUsername)}`;
    const ghResponse = await fetch(inviteUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${githubToken}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "Auterix-Gumroad-Webhook",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ permission: "pull" }),
    });

    if (ghResponse.status === 201) {
      console.log(`[Webhook] Successfully created invitation for ${cleanUsername} to ${repoOwner}/${repoName}`);
      return res.status(200).json({
        status: "success",
        action: "invited",
        github_username: cleanUsername,
        repository: `${repoOwner}/${repoName}`,
      });
    } else if (ghResponse.status === 204) {
      console.log(`[Webhook] ${cleanUsername} is already a collaborator on ${repoOwner}/${repoName}`);
      return res.status(200).json({
        status: "success",
        action: "already_collaborator",
        github_username: cleanUsername,
        repository: `${repoOwner}/${repoName}`,
      });
    } else {
      const errorText = await ghResponse.text();
      console.error(`[Webhook] GitHub API error (${ghResponse.status}): ${errorText}`);
      return res.status(200).json({
        status: "github_error",
        status_code: ghResponse.status,
        details: errorText,
        github_username: cleanUsername,
      });
    }
  } catch (err) {
    console.error("[Webhook] Unexpected error handling Gumroad ping:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
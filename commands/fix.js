module.exports = {
  name: "fixfb",
  description: "Fixes any Facebook link (profiles, posts, videos, groups, etc.)",
  nashPrefix: false,
  role: "user",
  execute: (api, event, args, prefix) => {
    const message = event.body.trim();

    if (!message.toLowerCase().startsWith("fixfb")) return;

    // Extract all URLs from the message
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = message.match(urlRegex);

    if (!urls || urls.length === 0) {
      return api.sendMessage("❌ Please provide a Facebook link after 'fixfb'.", event.threadID);
    }

    let results = [];

    for (const originalUrl of urls) {
      const fixedUrl = fixAnyFacebookLink(originalUrl);
      if (fixedUrl) {
        results.push(`✅ Fixed Link:\n${fixedUrl}`);
      } else {
        results.push(`❌ Could not fix: ${originalUrl}`);
      }
    }

    api.sendMessage(results.join("\n\n"), event.threadID);
  },
};

function fixAnyFacebookLink(url) {
  try {
    // Standardize URL format
    let cleanUrl = url
      .replace("m.facebook.com", "www.facebook.com")
      .replace("mobile.facebook.com", "www.facebook.com")
      .replace("fb.com", "facebook.com")
      .replace("https://facebook.com", "https://www.facebook.com");

    // Remove tracking parameters and fragments
    cleanUrl = cleanUrl.split('?')[0].split('#')[0];

    // Handle different Facebook URL patterns
    const patterns = [
      // Profile links
      {
        regex: /https:\/\/www\.facebook\.com\/(profile\.php\?id=\d+)/,
        fix: (match) => `https://www.facebook.com/${match[1]}`
      },
      {
        regex: /https:\/\/www\.facebook\.com\/([a-zA-Z0-9\.\-]+)\/?$/,
        fix: (match) => `https://www.facebook.com/${match[1]}`
      },

      // Post links
      {
        regex: /https:\/\/www\.facebook\.com\/(\d+)\/posts\/(\d+)/,
        fix: (match) => `https://www.facebook.com/permalink.php?story_fbid=${match[2]}&id=${match[1]}`
      },
      {
        regex: /https:\/\/www\.facebook\.com\/permalink\.php\?story_fbid=(\d+)&id=(\d+)/,
        fix: (match) => `https://www.facebook.com/permalink.php?story_fbid=${match[1]}&id=${match[2]}`
      },

      // Video links
      {
        regex: /https:\/\/www\.facebook\.com\/(\d+)\/videos\/(\d+)/,
        fix: (match) => `https://www.facebook.com/watch/?v=${match[2]}`
      },
      {
        regex: /https:\/\/www\.facebook\.com\/watch\/\?v=(\d+)/,
        fix: (match) => `https://www.facebook.com/watch/?v=${match[1]}`
      },

      // Photo links
      {
        regex: /https:\/\/www\.facebook\.com\/photo\.php\?fbid=(\d+)/,
        fix: (match) => `https://www.facebook.com/photo.php?fbid=${match[1]}`
      },

      // Group links
      {
        regex: /https:\/\/www\.facebook\.com\/groups\/(\d+)\/posts\/(\d+)/,
        fix: (match) => `https://www.facebook.com/groups/${match[1]}/posts/${match[2]}/`
      },
      {
        regex: /https:\/\/www\.facebook\.com\/groups\/([a-zA-Z0-9\.\-]+)/,
        fix: (match) => `https://www.facebook.com/groups/${match[1]}/`
      },

      // Events
      {
        regex: /https:\/\/www\.facebook\.com\/events\/(\d+)/,
        fix: (match) => `https://www.facebook.com/events/${match[1]}/`
      }
    ];

    // Try to match and fix the URL
    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern.regex);
      if (match) {
        return pattern.fix(match);
      }
    }

    // If no specific pattern matched but it's a facebook.com link, return cleaned version
    if (cleanUrl.includes('facebook.com/')) {
      return cleanUrl;
    }

    return null;
  } catch (e) {
    console.error("Error fixing Facebook link:", e);
    return null;
  }
}
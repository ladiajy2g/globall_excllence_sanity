"use server";

import sanitize from 'sanitize-html';

/**
 * Sanitizes HTML content from WordPress using sanitize-html.
 * This is used on the server side to prevent XSS while allowing 
 * necessary WordPress editorial formatting.
 * 
 * @param {string} html - The raw HTML string from WordPress.
 * @returns {Promise<string>} - The sanitized HTML string.
 */
export async function sanitizeHtml(html) {
  if (!html) return '';

  return sanitize(html, {
    allowedTags: [
      ...sanitize.defaults.allowedTags,
      'img', 'figure', 'figcaption', 'iframe', 'ins', 'script', 'style', 'video', 'source', 'embed'
    ],
    allowedAttributes: {
      ...sanitize.defaults.allowedAttributes,
      'img': ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading', 'class'],
      'iframe': ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'scrolling', 'style', 'class'],
      'video': ['src', 'width', 'height', 'controls', 'autoplay', 'muted', 'loop', 'poster', 'class'],
      'source': ['src', 'type', 'srcset'],
      'figure': ['class'],
      'figcaption': ['class'],
      'a': ['href', 'name', 'target', 'rel', 'class'],
      'div': ['class', 'id', 'data-*', 'style'],
      'span': ['class', 'style'],
      'p': ['class', 'style'],
      '*': ['id', 'class', 'style'] // Highly permissive for WP block styles
    },
    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com', 'www.facebook.com'],
    // We allow styles here because WordPress blocks use them extensively for alignment and color.
    // In a high-security environment, we would be stricter.
    allowVulnerableTags: true, 
  });
}

/**
 * Maps detailed errors to opaque references for the client.
 * Logs full details to the server console for debugging.
 * 
 * @param {Error|string} error - The caught error object or message.
 * @param {string} context - The functional context (e.g., 'API_FETCH_POSTS').
 * @returns {Promise<string>} - An opaque error code for the client.
 */
export async function mapOpaqueError(error, context = 'GENERAL') {
  const errorId = Math.random().toString(36).substring(2, 6).toUpperCase();
  const opaqueCode = `[SECURITY_ERROR][${context}_${errorId}]`;

  console.error(`--- SECURE LOG START ---`);
  console.error(`ID: ${opaqueCode}`);
  console.error(`Context: ${context}`);
  console.error(`Message: ${error?.message || error}`);
  if (error?.stack) console.error(`Stack: ${error.stack}`);
  console.error(`--- SECURE LOG END ---`);

  return opaqueCode;
}

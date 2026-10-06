# 07 Media and content products

Scope: the "I need media/content" decision tree from the source doc: Images optimization and transformation, Stream video encoding and delivery, Browser Rendering automation and screenshots, and Zaraz third-party script management.

## The tree as the source doc states it

The source doc (yubi-OS/yubiOS skills/cloudflare/SKILL.md) routes media by artifact:

- Image optimization and transformation: images/
- Video streaming and encoding: stream/
- Browser automation and screenshots: browser-rendering/
- Third-party script management: zaraz/

## Stream

The Stream docs overview (weight 0.94, https://developers.cloudflare.com/stream/, updated 2026-04-21) carries the defining description: Cloudflare Stream lets you or your end users upload, store, encode, and deliver live and on-demand video with one API, without configuring or maintaining infrastructure, from simple playback to an entire video platform. The product page (weight 0.42, weak) frames the same pipeline as upload via API or direct upload, automatic encoding to multiple formats and bitrates, and delivery through the global network with a built-in player; cite it as weak backing only.

The media-streaming use-case docs (weight 0.55, https://developers.cloudflare.com/use-cases/media-streaming/, updated 2026-04-24) place Stream inside the media stack the tree composes: Cloudflare Stream handles video upload, encoding, and adaptive bitrate delivery; Images transforms and optimizes images on-the-fly; R2 stores media files with zero egress fees; Cache serves content from 300+ edge locations; and Hotlink Protection and signed URLs secure media from unauthorized access. That page is the corpus's best evidence that the tree rows are components of one media architecture, and it supplies the 300+ edge locations figure at weight 0.55.

The media blog post (weight 0.77, https://blog.cloudflare.com/whats-next-for-cloudflare-media/) confirms the lineup is actively developed, covering updates for Calls, Stream, and Images aimed at reducing friction getting data into the products.

## Images

The Images docs (weight 0.94, https://developers.cloudflare.com/images) describe Images as an end-to-end solution for streamlining image handling. The product page (weight 0.53, https://www.cloudflare.com/products/images/) adds the positioning: scalable, reliable media pipelines to store, optimize, and deliver images, served fast anywhere through the CDN with optimized formats and responsive sizing.

## Zaraz

Zaraz has two high-weight doc sources. The Zaraz docs overview (weight 0.93, https://developers.cloudflare.com/zaraz/, updated 2026-08-14) states the design goal: built for speed, privacy, and security; load as many tools as needed with a near-zero performance hit; add many third-party tools and offload them from the website; and add Custom Managed Components that run as tools. The Pages how-to (weight 0.95, https://developers.cloudflare.com/pages/how-to/enable-zaraz/, updated 2026-04-21) covers enabling Zaraz on a Pages site and describes the same offload: complete control over third-party tools and services, moved to Cloudflare's edge to improve speed and security.

Weakly weighted third-party posts, labeled: the castelis guide (weight 0.12) and the eonsr post (weight 0.11) both describe moving third-party script execution (analytics, advertising) from the browser to Cloudflare's edge; the trevorlasn post (weight 0.15) reports a personal mobile performance score improving from around 75 to over 90 after adopting Zaraz; the dodatech tutorial (weight 0.10) lists Google Analytics, Facebook Pixel, and marketing scripts as loadable from the edge. All below the 0.5 authority line; the mechanism claim they share is already carried at 0.93 by the docs.

## Browser Rendering

The dig's media queries did not surface a high-weight Browser Rendering source; the row rests on the source doc's routing (browser automation and screenshots). Per the skill's retrieval doctrine (doc 01), any Browser Rendering limit, API signature, or pricing claim must be fetched from the docs channel before use rather than asserted from memory.

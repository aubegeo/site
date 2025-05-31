// /plugins/affiliateLinks.ts
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('content:file:beforeParse', (file) => {
    if (!file.body || !file.body.children) return;

    const keywordsToLinks: Record<string, string> = {
      'Kindle Scribe': 'https://www.amazon.fr/dp/B09BSM4SZJ?tag=TONTAG',
      'iPad Pro': 'https://www.amazon.fr/dp/B0CNG3QJ22?tag=TONTAG',
      'Kobo Libra 2': 'https://www.amazon.fr/dp/B09FY9X7J1?tag=TONTAG',
    };

    const ignoreInside = new Set(['a', 'code']);

    function autoLinkText(children: any[]) {
      for (const node of children) {
        if (node.type === 'text') {
          for (const [keyword, url] of Object.entries(keywordsToLinks)) {
            const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'g');
            if (keywordRegex.test(node.value)) {
              node.type = 'element';
              node.tag = 'span';
              node.children = node.value.split(keywordRegex).flatMap((part, index, arr) => {
                if (index < arr.length - 1) {
                  return [
                    { type: 'text', value: part },
                    {
                      type: 'element',
                      tag: 'a',
                      props: {
                        href: url,
                        target: '_blank',
                        rel: 'nofollow noopener',
                      },
                      children: [{ type: 'text', value: keyword }],
                    },
                  ];
                }
                return [{ type: 'text', value: part }];
              });
              break;
            }
          }
        } else if (node.children && !ignoreInside.has(node.tag)) {
          autoLinkText(node.children);
        }
      }
    }

    autoLinkText(file.body.children);
  });
});

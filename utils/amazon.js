"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAmazonAffiliateLink = void 0;
function formatAmazonAffiliateLink(link, productName, affiliateTag = 'autogeo07-21') {
    try {
        // Si le lien est vide ou invalide, créer un lien de recherche Amazon
        if (!link || !link.trim()) {
            const encodedQuery = encodeURIComponent(productName);
            return `https://www.amazon.fr/s?k=${encodedQuery}&tag=${affiliateTag}`;
        }
        const url = new URL(link);
        // Vérifie que c’est bien un lien Amazon
        if (!url.hostname.includes('amazon.'))
            return link;
        // Vérifie s'il y a déjà un tag affilié Amazon
        if (url.searchParams.has('tag'))
            return link;
        // Ajoute le tag affilié
        url.searchParams.set('tag', affiliateTag);
        return url.toString();
    }
    catch (e) {
        console.warn('Lien Amazon invalide :', link);
        // En cas d'erreur, fallback vers une recherche
        const encodedQuery = encodeURIComponent(productName);
        return `https://www.amazon.fr/s?k=${encodedQuery}&tag=${affiliateTag}`;
    }
}
exports.formatAmazonAffiliateLink = formatAmazonAffiliateLink;
//# sourceMappingURL=amazon.js.map
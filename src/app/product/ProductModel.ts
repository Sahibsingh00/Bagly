export const Product = {
    id: 1245,
    name: "Modello Dea",
    slug: "modello-dea",
    short_description: "ddScopri l'eleganza e la qualità del portafogli da donna Bagly, realizzato in vera pelle italiana. Questo accessorio combina stile e funzionalità, perfetto per ogni occasione. La pelle di alta qualità, morbida e resistente, garantisce un look raffinato e una lunga durata.",
    price: "35",
    meta_data: [
        {
            id: 16050,
            key: "dimensioni",
            value: "Lunghezza: 19cm Altezza: 10cm Profondità: 2cm"
        },
        {
            id: 16052,
            key: "materiali",
            value: "Vera Pelle, Metallo color oro"
        },
        {
            id: 16054,
            key: "cose_da_sapere",
            value: "Portafogli realizzato interamente in Italia."
        }
    ],
    price_html: "<del aria-hidden=\"true\"><span class=\"woocommerce-Price-amount amount\"><bdi><span class=\"woocommerce-Price-currencySymbol\">€</span>90</bdi></span></del> <span class=\"screen-reader-text\">Il prezzo originale era: €90.</span><ins aria-hidden=\"true\"><span class=\"woocommerce-Price-amount amount\"><bdi><span class=\"woocommerce-Price-currencySymbol\">€</span>35</bdi></span></ins><span class=\"screen-reader-text\">Il prezzo attuale è: €35.</span>",
    categories: [
        "Donna",
        "Nuovi arrivi",
        "Piccola pelletteria",
        "Portafogli"
    ],
    gallery_images: [
        {
            image_id: 1250,
            url: "assets/images/dummyImg.png",
            src: "assets/images/dummyImg.png"
        }
    ],
    variations: [
        {
            attributes: {
                attribute_pa_color: "giallo"
            },
            display_price: 35,
            display_regular_price: 90,
            image: "assets/images/dummyImg.png",
            price_html: "<del aria-hidden=\"true\"><span class=\"woocommerce-Price-amount amount\"><bdi><span class=\"woocommerce-Price-currencySymbol\">€</span>90</bdi></span></del> <span class=\"screen-reader-text\">Il prezzo originale era: €90.</span><ins aria-hidden=\"true\"><span class=\"woocommerce-Price-amount amount\"><bdi><span class=\"woocommerce-Price-currencySymbol\">€</span>35</bdi></span></ins><span class=\"screen-reader-text\">Il prezzo attuale è: €35.</span>",
            variation_id: 1247,
            variation_gallery_images: [
                {
                    url: "assets/images/dummyImg.png",
                },
                {
                    url: "assets/images/dummyImg.png",
                }
            ]
        },
        {
            attributes: {
                attribute_pa_color: "beige"
            },
            display_price: 35,
            display_regular_price: 90,
            image: "assets/images/dummyImg.png",
            price_html: "<del aria-hidden=\"true\"><span class=\"woocommerce-Price-amount amount\"><bdi><span class=\"woocommerce-Price-currencySymbol\">€</span>90</bdi></span></del> <span class=\"screen-reader-text\">Il prezzo originale era: €90.</span><ins aria-hidden=\"true\"><span class=\"woocommerce-Price-amount amount\"><bdi><span class=\"woocommerce-Price-currencySymbol\">€</span>35</bdi></span></ins><span class=\"screen-reader-text\">Il prezzo attuale è: €35.</span>",
            variation_id: 1247,
            variation_gallery_images: [
                {
                    url: "assets/images/dummyImg.png",
                },
                {
                    url: "assets/images/dummyImg.png",
                }
            ]
        }
    ]
};

export type ProductType = typeof Product;
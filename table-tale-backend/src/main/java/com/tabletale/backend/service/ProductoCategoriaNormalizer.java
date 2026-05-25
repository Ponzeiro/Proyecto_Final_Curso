package com.tabletale.backend.service;

import java.text.Normalizer;

public final class ProductoCategoriaNormalizer {

    private ProductoCategoriaNormalizer() {
    }

    public static String normalize(String categoria) {
        if (categoria == null) {
            return null;
        }

        String limpia = Normalizer.normalize(categoria.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replace("Â", "")
                .replace("°", "º")
                .toLowerCase();

        if (limpia.contains("postre")) {
            return "Postres";
        }
        if (limpia.contains("menu")) {
            return "Menú del día";
        }
        if (limpia.contains("cafe")) {
            return "Cafés";
        }
        if (limpia.contains("refresco")) {
            return "Refrescos";
        }
        if (limpia.contains("agua")) {
            return "Agua";
        }
        if (limpia.contains("cerveza")) {
            return "Cerveza";
        }
        if (limpia.contains("vermouth")) {
            return "Vermouth";
        }
        if (limpia.startsWith("1") || limpia.contains("primer") || limpia.contains("primero")) {
            return "1º plato";
        }
        if (limpia.startsWith("2") || limpia.contains("segund")) {
            return "2º plato";
        }

        return categoria.trim();
    }
}

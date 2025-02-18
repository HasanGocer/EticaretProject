import { Typography } from "@mui/material";

export const calculateDiscountedPrice = (price, discountRate) => {
  return price - (price * discountRate) / 100;
};

export const getCategoryName = (categorys, categoryId) => {
  const category = categorys.find((cat) => cat.id === categoryId);
  return category ? category.UrunAdi : "Bilinmeyen Kategori";
};
export const getTrademarkName = (trademarks, trademarkId) => {
  const trademark = trademarks.find(
    (trademark) => trademark.ID === trademarkId
  );
  return trademark ? trademark.UrunAdi : "Bilinmeyen Marka";
};
export const getVariantNames = (productVariants, variants, product) => {
  const variantNames = productVariants
    .filter((variant) => variant.product_id === product.id) // Filtreleme yapıyoruz
    .map((variant) => {
      const matchedvariant = variants.find(
        (af) => af.id === variant.variant_id
      );
      return matchedvariant ? (
        <li key={matchedvariant.id}>
          {matchedvariant.name}
          {matchedvariant.image_data ? (
            <img
              src={matchedvariant.image_data}
              alt="Varyant Resmi"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          ) : (
            <Typography variant="body2" color="textSecondary">
              Resim Eklenmemiş
            </Typography>
          )}
        </li>
      ) : null;
    }); // JSX döndürüyoruz

  return variantNames.length > 0 ? variantNames : <li>Bilinmeyen Varyant</li>; // Eğer variant bulunmazsa, bir varsayılan mesaj döner
};
export const getAdditionalFeatureNames = (
  productAdditionalFeature,
  additionalFeature,
  product
) => {
  const featureNames = productAdditionalFeature
    .filter((feature) => feature.product_id === product.id) // İlgili ürüne ait özellikleri filtreleme
    .map((feature) => {
      const matchedFeature = additionalFeature.find(
        (af) => af.id === feature.additionalfeature_id
      );
      return matchedFeature ? (
        <li key={matchedFeature.id}>{matchedFeature.name}</li>
      ) : null;
    })
    .filter(Boolean); // Null değerleri temizleme

  return featureNames.length > 0
    ? featureNames
    : [<li key="unknown">Bilinmeyen Özellik</li>];
};

export const getSubcategoryName = (subcategorys, subcategoryId) => {
  const subcategory = subcategorys.find(
    (subcat) => subcat.id === subcategoryId
  );
  return subcategory ? subcategory.name : "Bilinmeyen Alt Kategori";
};

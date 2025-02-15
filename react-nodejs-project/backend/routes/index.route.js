import express from "express";
import authRoutes from "./auth.routes.js";
import orderRoutes from "./order.route.js";
import additionalFeatureRoutes from "./additionalFeature.route.js";
import variantRoutes from "./variant.route.js";
import categoryRoutes from "./category.route.js";
import subcategoryRoutes from "./subcategory.routes.js";
import trademarkRoutes from "./trademark.route.js";
import productRoutes from "./product.route.js";
import product_additionalfeaturesRoutes from "./product_additionalfeatures.route.js";
import product_variantsRoutes from "./product_variants.route.js";
import product_additionalfeatures_detailsRoutes from "./product_additionalfeatures_details.route.js";
import product_variant_detailsRoutes from "./product_variant_details.route.js";

const router = express.Router();

// Rotaları mount etme
router.use("/auth", authRoutes);
router.use("/order", orderRoutes);
router.use("/additionalFeature", additionalFeatureRoutes);
router.use("/variant", variantRoutes);
router.use("/category", categoryRoutes);
router.use("/subcategory", subcategoryRoutes);
router.use("/trademark", trademarkRoutes);
router.use("/product", productRoutes);
router.use("/product_additionalfeatures", product_additionalfeaturesRoutes);
router.use("/product_variants", product_variantsRoutes);
router.use(
  "/product_additionalfeatures_details",
  product_additionalfeatures_detailsRoutes
);
router.use("/product_variant_details", product_variant_detailsRoutes);

export default router;

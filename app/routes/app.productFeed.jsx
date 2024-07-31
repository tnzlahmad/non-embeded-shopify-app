import React, { useState, useEffect } from "react";
import shopify from "../shopify.server";
import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import {
  Page,
  Card,
  Text,
  Button,
  BlockStack,
  InlineGrid,
} from "@shopify/polaris";
import { Header, TextFields, CheckBox, SelectBox } from "./components";
import { Row, Col } from "reactstrap";
import prisma from "../db.server";

export async function loader({ request }) {
  const { admin, session } = await shopify.authenticate.admin(request);
  const products = await admin.rest.resources.Product.all({ session });
  const collections = await prisma.collections.findMany();
  return json({ products, collections });
}

export const action = async ({ request }) => {
  const formData = await request.formData();

  const productFeedData = {
    feedName: formData.get("feedName") || null,
    currency: formData.get("currency") || null,
    productURL: formData.get("productURL") || null,
    allOrSomeProduct: formData.get("products") || null,
    chooseCollections: formData.get("collections") || null,
    exportMode: formData.get("export_mode") || null,
    exportSingleVariant: formData.get("single_variant") || null,
    comparePrice: formData.get("compare_price") || null,
    productVariantImg: formData.get("image_option") || null,
    customLabelsOne: formData.get("custom_labels_one") || null,
    customLabelsTwo: formData.get("custom_labels_two") || null,
    customLabelsThree: formData.get("custom_labels_three") || null,
    customLabelsFour: formData.get("custom_labels_four") || null,
    customLabelsFive: formData.get("custom_labels_five") || null,
    featCollCustomLabels: formData.get("feat_coll_custom_labels") || null,
    featProdTagsOnLabels: formData.get("feat_prod_tags_on_labels") || null,
    variantTitle: formData.get("variant_title") || null,
    customTax: formData.get("custom_tax") || null,
    excludeOptions: formData.get("exclude_options") || null,
    shippingLabel: formData.get("shipping_label") || null,
    addTaxAllPrices: formData.get("tax_option") || null,
  };

  try {
    const newProductFeed = await prisma.productFeed.create({
      data: productFeedData,
    });

    return json({ success: true, productFeed: newProductFeed });
  } catch (error) {
    console.error("Error saving product feed:", error);
    return json({ success: false, error: error.message });
  }
};

export default function ChangePlan() {
  const fetcher = useFetcher();
  const { collections } = useLoaderData();
  const [productURL, setProductURL] = useState("Do Not Append");
  const [selectedProducts, setSelectedProducts] = useState("All Products");
  const [selectedVariants, setSelectedVariants] = useState(
    "Export All Variants",
  );
  const [imageOption, setImageOption] = useState("Use Variant Image");
  const [comparePriceOption, setComparePriceOption] = useState("Compare Price");
  const [selectedOption, setSelectedOption] = useState("Do NOT append");
  const [selectedTaxOption, setSelectedTaxOption] = useState(
    "Use Global Settings",
  );

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    const handlers = {
      productURL: setProductURL,
      products: setSelectedProducts,
      export_mode: setSelectedVariants,
      image_option: setImageOption,
      compare_price: setComparePriceOption,
      variant_title: setSelectedOption,
      tax_option: setSelectedTaxOption,
    };
    handlers[name]?.(value);
  };

  const handleCheckBoxChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleTaxOptionChange = (e) => {
    setSelectedTaxOption(e.target.value);
  };

  const handleSaveClick = (event) => {
    event.preventDefault();
    const form = document.getElementById("productFeedForm");
    if (form) {
      fetcher.submit(new FormData(form), { method: "post" });
    } else {
      console.error("Form element not found");
    }
  };

  const currencyOptions = [{ title: "PKR", id: "1" }];

  const customLabels = [
    { id: "1", title: "Product Tag (comma separated)" },
    { id: "2", title: "Collection ids (comma separated)" },
    { id: "3", title: "SKU" },
    { id: "4", title: "Barcode" },
    { id: "5", title: "Product Handle" },
    { id: "6", title: "Product Variant" },
  ];

  return (
    <Page>
      <Header />
      <div className="mt-4">
        <Card>
          <form id="productFeedForm">
            <Row>
              {/* Left Section */}
              <Col md="9">
                <div className="row ">
                  <h5>Add a product feed</h5>
                  <TextFields
                    placeholder="Enter Product Feed Name"
                    type="text"
                    name="feedName"
                    classColMd="col-md-6"
                  />
                  <SelectBox
                    classColMd="col-md-6 mt-3"
                    options={currencyOptions} 
                    name="currency"
                  />
                </div>

                <div className="mt-3">
                  <h5>Append currency parameter to product URL?</h5>
                  <CheckBox
                    label="Do Not append. (default, example: my-store.com/products/my-product)"
                    value="Do Not Append"
                    name="productURL"
                    checked={productURL === "Do Not Append"}
                    onChange={handleRadioChange}
                  />
                  <CheckBox
                    label="Do Append, (example: my-store.com/products/my-product?currency=USD)"
                    value="Do Append"
                    name="productURL"
                    checked={productURL === "Do Append"}
                    onChange={handleRadioChange}
                  />
                </div>

                {/* Products */}
                <div className="mt-3">
                  <h5>All products or some of them?</h5>
                  <CheckBox
                    label="All products"
                    value="All Products"
                    name="products"
                    checked={selectedProducts === "All Products"}
                    onChange={handleRadioChange}
                  />
                  <CheckBox
                    label="Products from selected collection"
                    value="Products Selected"
                    name="products"
                    checked={selectedProducts === "Products Selected"}
                    onChange={handleRadioChange}
                  />
                </div>

                {selectedProducts === "Products Selected" && (
                  <div className="row mt-3">
                    <h5>Choose Collections</h5>
                    <SelectBox
                      classColMd="col-md-12"
                      options={collections}
                      name="collections"
                    />
                  </div>
                )}

                {/* Export Mode */}
                <div className="d-flex">
                  <div className="mt-3">
                    <h5>Export mode</h5>
                    <CheckBox
                      label="Export all variants of a product"
                      value="Export All Variants"
                      name="export_mode"
                      checked={selectedVariants === "Export All Variants"}
                      onChange={handleRadioChange}
                    />
                    <CheckBox
                      label="Export only one variant of a product"
                      value="Export One Variant"
                      name="export_mode"
                      checked={selectedVariants === "Export One Variant"}
                      onChange={handleRadioChange}
                    />
                  </div>

                  {selectedVariants === "Export One Variant" && (
                    <div className="mt-3">
                      <h5>Export single variant as:</h5>
                      <CheckBox
                        label="Export first variant of a product (default)"
                        value="first_variant"
                        name="single_variant"
                      />
                      <CheckBox
                        label="Export first available for order variant of a product"
                        value="available_variant"
                        name="single_variant"
                      />
                    </div>
                  )}
                </div>

                {/* Compare Price */}
                <div className="mt-3">
                  <h5>Use "Compare at" Price</h5>
                  <CheckBox
                    label="Use Both 'Compare at Price' and Price if They Exist (default)"
                    value="Compare Price"
                    name="compare_price"
                    checked={comparePriceOption === "Compare Price"}
                    onChange={handleRadioChange}
                  />
                  <CheckBox
                    label="Don't Use 'Compare at' Price - Only the Price Field from Shopify Will Be Used"
                    value="No Compare Price"
                    name="compare_price"
                    checked={comparePriceOption === "No Compare Price"}
                    onChange={handleRadioChange}
                  />
                </div>

                {/* Product and Variant Images */}
                <div className="mt-3">
                  <h5>Product and Variant Images</h5>
                  <CheckBox
                    label="Use Variant's Image if it Exists and Fallback to Using Product's Image"
                    value="Use Variant Image"
                    name="image_option"
                    checked={imageOption === "Use Variant Image"}
                    onChange={handleRadioChange}
                  />
                  <CheckBox
                    label="Always Use Product's Image (Never Use Variant's Image)"
                    value="Use Product Image"
                    name="image_option"
                    checked={imageOption === "Use Product Image"}
                    onChange={handleRadioChange}
                  />
                </div>

                {/* Custom Labels */}
                <div className="row mt-3">
                  <h5>Custom Labels</h5>
                  <SelectBox
                    classColMd="col-md-6"
                    options={customLabels}
                    name="custom_labels_one"
                  />
                  <SelectBox
                    classColMd="col-md-6"
                    options={customLabels}
                    name="custom_labels_two"
                  />
                  <SelectBox
                    classColMd="col-md-6"
                    options={customLabels}
                    name="custom_labels_three"
                  />
                  <SelectBox
                    classColMd="col-md-6"
                    options={customLabels}
                    name="custom_labels_four"
                  />
                  <SelectBox
                    classColMd="col-md-6"
                    options={customLabels}
                    name="custom_labels_five"
                  />
                </div>

                <div className="row mt-3">
                  <h5>Feature collection on custom labels</h5>
                  <SelectBox
                    classColMd="col-md-12"
                    options={collections}
                    name="feat_coll_custom_labels"
                  />
                </div>

                {/* Product Tags */}
                <div className="row">
                  <h5>
                    Feature Product tags on custom labels (press enter after you
                    type tag)
                  </h5>
                  <TextFields
                    placeholder="Enter Currency (PKR Only)"
                    type="text"
                    name="feat_prod_tags_on_labels"
                    classColMd="col-md-12"
                  />
                </div>

                <div className="mt-3">
                  <h5>Variant Titles</h5>
                  <p>
                    Example: you sell t-shirts with two color options, red and
                    white, and two sizes, S and M
                  </p>
                  <CheckBox
                    label="Do NOT append (default) - all t-shirt would be exported as 't-shirt'"
                    value="Do NOT append"
                    name="variant_title"
                    checked={selectedOption === "Do NOT append"}
                    onChange={handleCheckBoxChange}
                  />
                  <CheckBox
                    label="Append variant's title - t-shirt would be exported as 't-shirt [variant title from Shopify admin]'"
                    value="Append variant's title"
                    name="variant_title"
                    checked={selectedOption === "Append variant's title"}
                    onChange={handleCheckBoxChange}
                  />

                  <CheckBox
                    label="Prepend variant's title - t-shirt title would be exported as '[variant title from Shopify admin] t-shirt'"
                    value="Prepend variant's title"
                    name="variant_title"
                    checked={selectedOption === "Prepend variant's title"}
                    onChange={handleCheckBoxChange}
                  />

                  <CheckBox
                    label="Append options - t-shirt title would be exported as t-shirt red S and t-shirt white M"
                    value="Append options"
                    name="variant_title"
                    checked={selectedOption === "Append options"}
                    onChange={handleCheckBoxChange}
                  />

                  <CheckBox
                    label="Append variant's SKU t-shirt title would be exported as 't-shirt SKU-CODE'"
                    value="Append variant's SKU"
                    name="variant_title"
                    checked={selectedOption === "Append variant's SKU"}
                    onChange={handleCheckBoxChange}
                  />

                  <CheckBox
                    label="Append custom text - t-shirt title would be exported as t-shirt (you custom text), enter below"
                    value="Append custom text"
                    name="variant_title"
                    checked={selectedOption === "Append custom text"}
                    onChange={handleCheckBoxChange}
                  />
                </div>

                <div className="row">
                  <h5>Custom text to append</h5>
                  <TextFields
                    placeholder="Custom Tax"
                    type="text"
                    name="custom_tax"
                    classColMd="col-md-12"
                  />
                </div>

                <div className="row mt-3">
                  <h5>
                    Exclude option (such as size) from the generated variant
                    title (above)
                  </h5>
                  <TextFields
                    placeholder="Tax to exclude"
                    type="text"
                    name="exclude_options"
                    classColMd="col-md-12"
                  />
                </div>

                <div className="row mt-3">
                  <h5>Shipping Label (applies to all product feed)</h5>
                  <TextFields
                    placeholder="Shipping Label"
                    type="text"
                    name="shipping_label"
                    classColMd="col-md-12"
                  />
                </div>

                <div className="mt-3">
                  <h5>Add tax to all prices - override global Settings</h5>
                  <CheckBox
                    label="Use Global Settings (default)"
                    value="Use Global Settings"
                    name="tax_option"
                    checked={selectedTaxOption === "Use Global Settings"}
                    onChange={handleTaxOptionChange}
                  />
                  <CheckBox
                    label="Do NOT add tax prices"
                    value="Do Not Add Tax Prices"
                    name="tax_option"
                    checked={selectedTaxOption === "Do Not Add Tax Prices"}
                    onChange={handleTaxOptionChange}
                  />

                  <CheckBox
                    label="Do add tax to prices - set tax rate below"
                    value="Do add Tax To Prices - Set Tax Rate Below"
                    name="tax_option"
                    checked={
                      selectedTaxOption ===
                      "Do add Tax To Prices - Set Tax Rate Below"
                    }
                    onChange={handleTaxOptionChange}
                  />
                </div>
              </Col>

              {/* Right Section */}
              <Col md="3">
                <div className="d-flex flex-column justify-content-end h-100">
                  <button
                    type="button"
                    className="btn btn-success mt-4"
                    onClick={handleSaveClick}
                  >
                    Create Product Feed
                  </button>
                </div>
              </Col>
            </Row>
          </form>
        </Card>
      </div>
    </Page>
  );
}

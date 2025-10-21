import { gql } from 'graphql-tag';

// Product mutations
export const PRODUCT_CREATE = gql`
  mutation ProductCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        name
        slug
        description
        seoTitle
        seoDescription
        category {
          id
          name
        }
        isAvailableForPurchase
        availableForPurchase
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const PRODUCT_UPDATE = gql`
  mutation ProductUpdate($id: ID!, $input: ProductInput!) {
    productUpdate(id: $id, input: $input) {
      product {
        id
        name
        slug
        description
        seoTitle
        seoDescription
        category {
          id
          name
        }
        isAvailableForPurchase
        availableForPurchase
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const PRODUCT_DELETE = gql`
  mutation ProductDelete($id: ID!) {
    productDelete(id: $id) {
      product {
        id
        name
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const PRODUCT_BULK_DELETE = gql`
  mutation ProductBulkDelete($ids: [ID!]!) {
    productBulkDelete(ids: $ids) {
      count
      errors {
        field
        message
        code
      }
    }
  }
`;

// Product variant mutations
export const PRODUCT_VARIANT_CREATE = gql`
  mutation ProductVariantCreate($input: ProductVariantInput!) {
    productVariantCreate(input: $input) {
      productVariant {
        id
        name
        sku
        pricing {
          price {
            gross {
              amount
              currency
            }
          }
        }
        attributes {
          attribute {
            id
            name
          }
          values {
            id
            name
          }
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const PRODUCT_VARIANT_UPDATE = gql`
  mutation ProductVariantUpdate($id: ID!, $input: ProductVariantInput!) {
    productVariantUpdate(id: $id, input: $input) {
      productVariant {
        id
        name
        sku
        pricing {
          price {
            gross {
              amount
              currency
            }
          }
        }
        attributes {
          attribute {
            id
            name
          }
          values {
            id
            name
          }
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const PRODUCT_VARIANT_DELETE = gql`
  mutation ProductVariantDelete($id: ID!) {
    productVariantDelete(id: $id) {
      productVariant {
        id
        name
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

// Order mutations
export const ORDER_UPDATE = gql`
  mutation OrderUpdate($id: ID!, $input: OrderUpdateInput!) {
    orderUpdate(id: $id, input: $input) {
      order {
        id
        status
        statusDisplay
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const ORDER_FULFILL = gql`
  mutation OrderFulfill($id: ID!, $input: OrderFulfillInput!) {
    orderFulfill(id: $id, input: $input) {
      order {
        id
        status
        statusDisplay
        fulfillments {
          id
          status
          trackingNumber
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const ORDER_CANCEL = gql`
  mutation OrderCancel($id: ID!) {
    orderCancel(id: $id) {
      order {
        id
        status
        statusDisplay
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

// Customer mutations
export const CUSTOMER_CREATE = gql`
  mutation CustomerCreate($input: UserCreateInput!) {
    customerCreate(input: $input) {
      user {
        id
        email
        firstName
        lastName
        isActive
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const CUSTOMER_UPDATE = gql`
  mutation CustomerUpdate($id: ID!, $input: CustomerInput!) {
    customerUpdate(id: $id, input: $input) {
      user {
        id
        email
        firstName
        lastName
        isActive
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const CUSTOMER_DELETE = gql`
  mutation CustomerDelete($id: ID!) {
    customerDelete(id: $id) {
      user {
        id
        email
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

// Category mutations
export const CATEGORY_CREATE = gql`
  mutation CategoryCreate($input: CategoryInput!) {
    categoryCreate(input: $input) {
      category {
        id
        name
        slug
        description
        seoTitle
        seoDescription
        parent {
          id
          name
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const CATEGORY_UPDATE = gql`
  mutation CategoryUpdate($id: ID!, $input: CategoryInput!) {
    categoryUpdate(id: $id, input: $input) {
      category {
        id
        name
        slug
        description
        seoTitle
        seoDescription
        parent {
          id
          name
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const CATEGORY_DELETE = gql`
  mutation CategoryDelete($id: ID!) {
    categoryDelete(id: $id) {
      category {
        id
        name
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

// Collection mutations
export const COLLECTION_CREATE = gql`
  mutation CollectionCreate($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection {
        id
        name
        slug
        description
        seoTitle
        seoDescription
        isPublished
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const COLLECTION_UPDATE = gql`
  mutation CollectionUpdate($id: ID!, $input: CollectionInput!) {
    collectionUpdate(id: $id, input: $input) {
      collection {
        id
        name
        slug
        description
        seoTitle
        seoDescription
        isPublished
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const COLLECTION_DELETE = gql`
  mutation CollectionDelete($id: ID!) {
    collectionDelete(id: $id) {
      collection {
        id
        name
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

// File upload mutations
export const FILE_UPLOAD = gql`
  mutation FileUpload($file: Upload!) {
    fileUpload(file: $file) {
      uploadedFile {
        id
        url
        contentType
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

// Product media mutations
export const PRODUCT_MEDIA_CREATE = gql`
  mutation ProductMediaCreate($productId: ID!, $input: ProductMediaCreateInput!) {
    productMediaCreate(productId: $productId, input: $input) {
      product {
        id
        media {
          id
          url
          alt
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const PRODUCT_MEDIA_DELETE = gql`
  mutation ProductMediaDelete($id: ID!) {
    productMediaDelete(id: $id) {
      product {
        id
        media {
          id
          url
          alt
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

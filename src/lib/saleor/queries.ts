import { gql } from 'graphql-tag';

// Product queries
export const PRODUCT_LIST = gql`
  query ProductList($first: Int = 9, $channel: String!) {
    products(first: $first, channel: $channel) {
      edges {
        node {
          ...ProductListItem
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const PRODUCT_LIST_ITEM = gql`
  fragment ProductListItem on Product {
    id
    name
    slug
    description
    seoTitle
    seoDescription
    pricing {
      priceRange {
        start {
          gross {
            amount
            currency
          }
        }
        stop {
          gross {
            amount
            currency
          }
        }
      }
    }
    category {
      id
      name
      slug
    }
    thumbnail(size: 1024, format: WEBP) {
      url
      alt
    }
    media {
      id
      url
      alt
    }
    variants {
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
    isAvailableForPurchase
    availableForPurchase
  }
`;

export const PRODUCT_DETAILS = gql`
  query ProductDetails($id: ID!, $channel: String!) {
    product(id: $id, channel: $channel) {
      ...ProductDetails
    }
  }
`;

export const PRODUCT_DETAILS_FRAGMENT = gql`
  fragment ProductDetails on Product {
    id
    name
    slug
    description
    seoTitle
    seoDescription
    pricing {
      priceRange {
        start {
          gross {
            amount
            currency
          }
        }
        stop {
          gross {
            amount
            currency
          }
        }
      }
    }
    category {
      id
      name
      slug
    }
    collections {
      id
      name
      slug
    }
    thumbnail(size: 1024, format: WEBP) {
      url
      alt
    }
    media {
      id
      url
      alt
    }
    variants {
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
    isAvailableForPurchase
    availableForPurchase
  }
`;

// Order queries
export const ORDER_LIST = gql`
  query OrderList($first: Int = 10, $after: String) {
    orders(first: $first, after: $after) {
      edges {
        node {
          ...OrderDetails
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const ORDER_DETAILS = gql`
  fragment OrderDetails on Order {
    id
    number
    status
    statusDisplay
    created
    userEmail
    total {
      gross {
        amount
        currency
      }
    }
    lines {
      id
      productName
      variantName
      quantity
      unitPrice {
        gross {
          amount
          currency
        }
      }
      totalPrice {
        gross {
          amount
          currency
        }
      }
    }
    shippingAddress {
      firstName
      lastName
      streetAddress1
      streetAddress2
      city
      postalCode
      country {
        code
        country
      }
    }
    billingAddress {
      firstName
      lastName
      streetAddress1
      streetAddress2
      city
      postalCode
      country {
        code
        country
      }
    }
  }
`;

// Customer queries
export const CUSTOMER_LIST = gql`
  query CustomerList($first: Int = 10, $after: String) {
    customers(first: $first, after: $after) {
      edges {
        node {
          ...CustomerDetails
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const CUSTOMER_DETAILS = gql`
  fragment CustomerDetails on User {
    id
    email
    firstName
    lastName
    isActive
    dateJoined
    lastLogin
    defaultShippingAddress {
      id
      firstName
      lastName
      streetAddress1
      streetAddress2
      city
      postalCode
      country {
        code
        country
      }
    }
    defaultBillingAddress {
      id
      firstName
      lastName
      streetAddress1
      streetAddress2
      city
      postalCode
      country {
        code
        country
      }
    }
  }
`;

// Category queries
export const CATEGORY_LIST = gql`
  query CategoryList($first: Int = 10, $after: String) {
    categories(first: $first, after: $after) {
      edges {
        node {
          ...CategoryDetails
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const CATEGORY_DETAILS = gql`
  fragment CategoryDetails on Category {
    id
    name
    slug
    description
    seoTitle
    seoDescription
    backgroundImage {
      url
      alt
    }
    parent {
      id
      name
      slug
    }
    children {
      id
      name
      slug
    }
  }
`;

// Collection queries
export const COLLECTION_LIST = gql`
  query CollectionList($first: Int = 10, $after: String) {
    collections(first: $first, after: $after) {
      edges {
        node {
          ...CollectionDetails
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const COLLECTION_DETAILS = gql`
  fragment CollectionDetails on Collection {
    id
    name
    slug
    description
    seoTitle
    seoDescription
    backgroundImage {
      url
      alt
    }
    isPublished
  }
`;

// Search queries
export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!, $first: Int = 10, $channel: String!) {
    products(first: $first, channel: $channel, search: $query) {
      edges {
        node {
          ...ProductListItem
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

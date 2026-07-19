--
-- PostgreSQL database dump
--

\restrict cksDmHfsUGR5sP0Q5QQ2PWBQgOZENJGMRWe4wCfww0PCBPfMrCjh5QIOMh3fhre

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.3 (Debian 18.3-1+b1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: ContactPriority; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ContactPriority" AS ENUM (
    'LOW',
    'NORMAL',
    'HIGH',
    'URGENT'
);


--
-- Name: ContactStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ContactStatus" AS ENUM (
    'NEW',
    'OPEN',
    'AWAITING_CUSTOMER',
    'AWAITING_ADMIN',
    'RESOLVED',
    'CLOSED',
    'SPAM'
);


--
-- Name: EmailChannel; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EmailChannel" AS ENUM (
    'TRANSACTIONAL',
    'MARKETING',
    'AUTOMATION',
    'ADMIN'
);


--
-- Name: EmailStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EmailStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'SENT',
    'FAILED',
    'CANCELLED'
);


--
-- Name: ImportStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ImportStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED'
);


--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'PAID',
    'FAILED',
    'CANCELLED',
    'EXPIRED',
    'REFUNDED',
    'DELIVERED'
);


--
-- Name: ProductStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ProductStatus" AS ENUM (
    'DRAFT',
    'ACTIVE',
    'ARCHIVED'
);


--
-- Name: StockStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."StockStatus" AS ENUM (
    'IN_STOCK',
    'OUT_OF_STOCK',
    'BACKORDER'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: BlogPost; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BlogPost" (
    id bigint NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    content text NOT NULL,
    "coverImage" text,
    "isPublished" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "aiGenerationStatus" text,
    "aiModel" text,
    faqs jsonb,
    "focusKeyword" text,
    "generatedByAI" boolean DEFAULT false NOT NULL,
    "secondaryKeywords" jsonb,
    "seoDescription" text,
    "seoScore" integer DEFAULT 0 NOT NULL,
    "seoTitle" text,
    "sourceProductId" bigint
);


--
-- Name: BlogPost_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."BlogPost_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: BlogPost_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."BlogPost_id_seq" OWNED BY public."BlogPost".id;


--
-- Name: Brand; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Brand" (
    id bigint NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    logo text,
    "seoTitle" text,
    "seoDescription" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "showOnHome" boolean DEFAULT true NOT NULL,
    faqs jsonb
);


--
-- Name: Brand_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Brand_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Brand_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Brand_id_seq" OWNED BY public."Brand".id;


--
-- Name: Category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Category" (
    id bigint NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "parentId" bigint,
    "seoTitle" text,
    "seoDescription" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    image text,
    "showOnHome" boolean DEFAULT false NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL
);


--
-- Name: CategoryCircle; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CategoryCircle" (
    id bigint NOT NULL,
    name text NOT NULL,
    image text NOT NULL,
    url text NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: CategoryCircle_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."CategoryCircle_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: CategoryCircle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."CategoryCircle_id_seq" OWNED BY public."CategoryCircle".id;


--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Category_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: ContactConversation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ContactConversation" (
    id bigint NOT NULL,
    "conversationId" text NOT NULL,
    "customerId" bigint,
    "guestName" text,
    "guestEmail" text,
    "guestPhone" text,
    "guestToken" text,
    category text NOT NULL,
    "orderId" text,
    subject text NOT NULL,
    status public."ContactStatus" DEFAULT 'NEW'::public."ContactStatus" NOT NULL,
    priority public."ContactPriority" DEFAULT 'NORMAL'::public."ContactPriority" NOT NULL,
    "assignedAdminId" bigint,
    source text DEFAULT 'WEB_FORM'::text NOT NULL,
    "isReadByAdmin" boolean DEFAULT false NOT NULL,
    "isReadByCustomer" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastReplyAt" timestamp(3) without time zone,
    "closedAt" timestamp(3) without time zone
);


--
-- Name: ContactConversation_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ContactConversation_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ContactConversation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ContactConversation_id_seq" OWNED BY public."ContactConversation".id;


--
-- Name: ContactMessage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ContactMessage" (
    id bigint NOT NULL,
    "conversationId" bigint NOT NULL,
    "senderType" text NOT NULL,
    "senderCustomerId" bigint,
    "senderAdminId" bigint,
    body text NOT NULL,
    attachment text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "readAt" timestamp(3) without time zone
);


--
-- Name: ContactMessage_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ContactMessage_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ContactMessage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ContactMessage_id_seq" OWNED BY public."ContactMessage".id;


--
-- Name: Coupon; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Coupon" (
    id bigint NOT NULL,
    code text NOT NULL,
    "discountType" text NOT NULL,
    "discountValue" numeric(12,2) NOT NULL,
    "minOrderValue" numeric(12,2),
    "isActive" boolean DEFAULT true NOT NULL,
    "expiresAt" timestamp(3) without time zone,
    "usageLimit" integer,
    "usageCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Coupon_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Coupon_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Coupon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Coupon_id_seq" OWNED BY public."Coupon".id;


--
-- Name: Currency; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Currency" (
    id bigint NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    symbol text NOT NULL,
    "exchangeRate" numeric(10,4) DEFAULT 1.0000 NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Currency_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Currency_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Currency_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Currency_id_seq" OWNED BY public."Currency".id;


--
-- Name: Customer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Customer" (
    id bigint NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    "firstName" text,
    "lastName" text,
    orders integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "acceptTerms" boolean DEFAULT false NOT NULL,
    "marketingConsent" boolean DEFAULT false NOT NULL,
    phone text,
    "ageConfirmed" boolean DEFAULT false NOT NULL,
    "isBlocked" boolean DEFAULT false NOT NULL
);


--
-- Name: CustomerAddress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CustomerAddress" (
    id bigint NOT NULL,
    "customerId" bigint NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    company text,
    "addressLine1" text NOT NULL,
    "addressLine2" text,
    city text NOT NULL,
    state text NOT NULL,
    "postalCode" text NOT NULL,
    country text NOT NULL,
    "isDefaultShipping" boolean DEFAULT false NOT NULL,
    "isDefaultBilling" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: CustomerAddress_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."CustomerAddress_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: CustomerAddress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."CustomerAddress_id_seq" OWNED BY public."CustomerAddress".id;


--
-- Name: Customer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Customer_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Customer_id_seq" OWNED BY public."Customer".id;


--
-- Name: EmailCampaign; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."EmailCampaign" (
    id bigint NOT NULL,
    name text NOT NULL,
    subject text NOT NULL,
    status public."EmailStatus" DEFAULT 'PENDING'::public."EmailStatus" NOT NULL,
    "scheduledAt" timestamp(3) without time zone,
    "sentCount" integer DEFAULT 0 NOT NULL,
    "failedCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: EmailCampaign_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."EmailCampaign_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: EmailCampaign_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."EmailCampaign_id_seq" OWNED BY public."EmailCampaign".id;


--
-- Name: EmailJob; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."EmailJob" (
    id bigint NOT NULL,
    "idempotencyKey" text NOT NULL,
    channel public."EmailChannel" DEFAULT 'TRANSACTIONAL'::public."EmailChannel" NOT NULL,
    status public."EmailStatus" DEFAULT 'PENDING'::public."EmailStatus" NOT NULL,
    "recipientEmail" text NOT NULL,
    "customerId" bigint,
    "templateId" bigint,
    "campaignId" bigint,
    payload jsonb,
    "attemptCount" integer DEFAULT 0 NOT NULL,
    "maxAttempts" integer DEFAULT 3 NOT NULL,
    "nextAttemptAt" timestamp(3) without time zone,
    "providerMsgId" text,
    "errorLogs" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "sentAt" timestamp(3) without time zone
);


--
-- Name: EmailJob_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."EmailJob_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: EmailJob_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."EmailJob_id_seq" OWNED BY public."EmailJob".id;


--
-- Name: EmailPreference; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."EmailPreference" (
    id bigint NOT NULL,
    "customerId" bigint NOT NULL,
    topics jsonb,
    "globalUnsubscribe" boolean DEFAULT false NOT NULL,
    "isBounced" boolean DEFAULT false NOT NULL,
    "isSpamComplaint" boolean DEFAULT false NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: EmailPreference_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."EmailPreference_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: EmailPreference_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."EmailPreference_id_seq" OWNED BY public."EmailPreference".id;


--
-- Name: EmailTemplate; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."EmailTemplate" (
    id bigint NOT NULL,
    name text NOT NULL,
    subject text NOT NULL,
    "htmlBody" text NOT NULL,
    "textBody" text,
    channel public."EmailChannel" DEFAULT 'TRANSACTIONAL'::public."EmailChannel" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: EmailTemplate_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."EmailTemplate_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: EmailTemplate_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."EmailTemplate_id_seq" OWNED BY public."EmailTemplate".id;


--
-- Name: Order; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Order" (
    id bigint NOT NULL,
    "orderNumber" text NOT NULL,
    "customerId" bigint,
    "customerEmail" text NOT NULL,
    "totalAmount" numeric(12,2) NOT NULL,
    currency text DEFAULT 'CAD'::text NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "paymentRef" text,
    "shippingAddress" jsonb,
    "billingAddress" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "secureToken" text NOT NULL
);


--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."OrderItem" (
    id bigint NOT NULL,
    "orderId" bigint NOT NULL,
    "productId" bigint NOT NULL,
    "variantId" bigint,
    title text NOT NULL,
    quantity integer NOT NULL,
    "unitPrice" numeric(12,2) NOT NULL,
    "totalPrice" numeric(12,2) NOT NULL
);


--
-- Name: OrderItem_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."OrderItem_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: OrderItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."OrderItem_id_seq" OWNED BY public."OrderItem".id;


--
-- Name: Order_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Order_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Order_id_seq" OWNED BY public."Order".id;


--
-- Name: PaymentGateway; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PaymentGateway" (
    id bigint NOT NULL,
    name text NOT NULL,
    "merchantId" text,
    "publicKey" text,
    "secretKey" text,
    "isActive" boolean DEFAULT false NOT NULL,
    "isTestMode" boolean DEFAULT true NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: PaymentGateway_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PaymentGateway_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: PaymentGateway_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PaymentGateway_id_seq" OWNED BY public."PaymentGateway".id;


--
-- Name: Product; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Product" (
    id bigint NOT NULL,
    sku text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    "shortDescription" text,
    description text,
    status public."ProductStatus" DEFAULT 'ACTIVE'::public."ProductStatus" NOT NULL,
    "basePrice" numeric(12,2) NOT NULL,
    "salePrice" numeric(12,2),
    "stockStatus" public."StockStatus" DEFAULT 'IN_STOCK'::public."StockStatus" NOT NULL,
    "stockQuantity" integer DEFAULT 0 NOT NULL,
    "mainImage" text,
    "seoTitle" text,
    "seoDescription" text,
    "canonicalUrl" text,
    "categoryId" bigint,
    "brandId" bigint,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    details jsonb,
    faq jsonb,
    benefits jsonb,
    features jsonb,
    "focusKeyword" text,
    "generatedByAI" boolean DEFAULT false NOT NULL,
    "ogDescription" text,
    "ogTitle" text,
    "productType" text,
    "readinessScore" integer DEFAULT 0 NOT NULL,
    "secondaryKeywords" jsonb,
    specifications jsonb,
    tags jsonb,
    "validationStatus" text,
    "videoUrl" text,
    height numeric(10,2),
    "isFeatured" boolean DEFAULT false NOT NULL,
    length numeric(10,2),
    "lowStockLimit" integer,
    "returnInfo" text,
    "saleEndDate" timestamp(3) without time zone,
    "saleStartDate" timestamp(3) without time zone,
    "shippingInfo" jsonb,
    "warrantyInfo" text,
    weight numeric(10,2),
    width numeric(10,2),
    "importBatchId" text,
    barcode text
);


--
-- Name: ProductImage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ProductImage" (
    id bigint NOT NULL,
    "productId" bigint NOT NULL,
    "imageUrl" text NOT NULL,
    "altText" text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    bytes integer,
    format text,
    height integer,
    "isPrimary" boolean DEFAULT false NOT NULL,
    "publicId" text,
    width integer
);


--
-- Name: ProductImage_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ProductImage_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ProductImage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ProductImage_id_seq" OWNED BY public."ProductImage".id;


--
-- Name: ProductImportBatch; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ProductImportBatch" (
    id text NOT NULL,
    filename text,
    status public."ImportStatus" DEFAULT 'PENDING'::public."ImportStatus" NOT NULL,
    "totalRows" integer DEFAULT 0 NOT NULL,
    "successRows" integer DEFAULT 0 NOT NULL,
    "failedRows" integer DEFAULT 0 NOT NULL,
    message text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "updateMode" text DEFAULT 'FULL'::text NOT NULL
);


--
-- Name: ProductImportRow; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ProductImportRow" (
    id bigint NOT NULL,
    "batchId" text NOT NULL,
    "rowNumber" integer NOT NULL,
    sku text,
    title text,
    slug text,
    "categorySlug" text,
    "categoryName" text,
    "brandSlug" text,
    "brandName" text,
    price numeric(12,2),
    "salePrice" numeric(12,2),
    "stockQuantity" integer,
    "imageUrl" text,
    "seoTitle" text,
    "seoDescription" text,
    "rawData" jsonb,
    "errorMessage" text,
    "processedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    barcode text,
    "variantImage" text
);


--
-- Name: ProductImportRow_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ProductImportRow_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ProductImportRow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ProductImportRow_id_seq" OWNED BY public."ProductImportRow".id;


--
-- Name: ProductVariant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ProductVariant" (
    id bigint NOT NULL,
    "productId" bigint NOT NULL,
    sku text NOT NULL,
    price numeric(12,2) NOT NULL,
    "salePrice" numeric(12,2),
    "stockQuantity" integer DEFAULT 0 NOT NULL,
    "stockStatus" public."StockStatus" DEFAULT 'IN_STOCK'::public."StockStatus" NOT NULL,
    attributes jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    image text,
    "isEnabled" boolean DEFAULT true NOT NULL,
    barcode text
);


--
-- Name: ProductVariant_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ProductVariant_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ProductVariant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ProductVariant_id_seq" OWNED BY public."ProductVariant".id;


--
-- Name: Product_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Product_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Product_id_seq" OWNED BY public."Product".id;


--
-- Name: Review; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Review" (
    id bigint NOT NULL,
    "productId" bigint NOT NULL,
    rating integer NOT NULL,
    title text,
    body text,
    author text,
    approved boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Review_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Review_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Review_id_seq" OWNED BY public."Review".id;


--
-- Name: ShippingMethod; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ShippingMethod" (
    id bigint NOT NULL,
    name text NOT NULL,
    price numeric(12,2) NOT NULL,
    "estimatedDays" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ShippingMethod_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ShippingMethod_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ShippingMethod_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ShippingMethod_id_seq" OWNED BY public."ShippingMethod".id;


--
-- Name: StoreSettings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StoreSettings" (
    id integer DEFAULT 1 NOT NULL,
    "storeName" text DEFAULT 'SexToys Lovers'::text NOT NULL,
    "storeDescription" text DEFAULT 'Your premium destination for the world''s best products. Fast shipping, secure payments, and 24/7 support.'::text NOT NULL,
    "facebookUrl" text,
    "twitterUrl" text,
    "instagramUrl" text,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "taxEnabled" boolean DEFAULT false NOT NULL,
    "taxIncludedInPrices" boolean DEFAULT false NOT NULL,
    "taxRate" numeric(5,4) DEFAULT 0.0000 NOT NULL
);


--
-- Name: Wishlist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Wishlist" (
    id bigint NOT NULL,
    "customerId" bigint NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: WishlistItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."WishlistItem" (
    id bigint NOT NULL,
    "wishlistId" bigint NOT NULL,
    "productId" bigint NOT NULL,
    "variantId" bigint,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: WishlistItem_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."WishlistItem_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: WishlistItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."WishlistItem_id_seq" OWNED BY public."WishlistItem".id;


--
-- Name: Wishlist_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Wishlist_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Wishlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Wishlist_id_seq" OWNED BY public."Wishlist".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: BlogPost id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BlogPost" ALTER COLUMN id SET DEFAULT nextval('public."BlogPost_id_seq"'::regclass);


--
-- Name: Brand id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Brand" ALTER COLUMN id SET DEFAULT nextval('public."Brand_id_seq"'::regclass);


--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: CategoryCircle id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CategoryCircle" ALTER COLUMN id SET DEFAULT nextval('public."CategoryCircle_id_seq"'::regclass);


--
-- Name: ContactConversation id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContactConversation" ALTER COLUMN id SET DEFAULT nextval('public."ContactConversation_id_seq"'::regclass);


--
-- Name: ContactMessage id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContactMessage" ALTER COLUMN id SET DEFAULT nextval('public."ContactMessage_id_seq"'::regclass);


--
-- Name: Coupon id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Coupon" ALTER COLUMN id SET DEFAULT nextval('public."Coupon_id_seq"'::regclass);


--
-- Name: Currency id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Currency" ALTER COLUMN id SET DEFAULT nextval('public."Currency_id_seq"'::regclass);


--
-- Name: Customer id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Customer" ALTER COLUMN id SET DEFAULT nextval('public."Customer_id_seq"'::regclass);


--
-- Name: CustomerAddress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CustomerAddress" ALTER COLUMN id SET DEFAULT nextval('public."CustomerAddress_id_seq"'::regclass);


--
-- Name: EmailCampaign id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EmailCampaign" ALTER COLUMN id SET DEFAULT nextval('public."EmailCampaign_id_seq"'::regclass);


--
-- Name: EmailJob id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EmailJob" ALTER COLUMN id SET DEFAULT nextval('public."EmailJob_id_seq"'::regclass);


--
-- Name: EmailPreference id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EmailPreference" ALTER COLUMN id SET DEFAULT nextval('public."EmailPreference_id_seq"'::regclass);


--
-- Name: EmailTemplate id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EmailTemplate" ALTER COLUMN id SET DEFAULT nextval('public."EmailTemplate_id_seq"'::regclass);


--
-- Name: Order id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Order" ALTER COLUMN id SET DEFAULT nextval('public."Order_id_seq"'::regclass);


--
-- Name: OrderItem id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItem" ALTER COLUMN id SET DEFAULT nextval('public."OrderItem_id_seq"'::regclass);


--
-- Name: PaymentGateway id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PaymentGateway" ALTER COLUMN id SET DEFAULT nextval('public."PaymentGateway_id_seq"'::regclass);


--
-- Name: Product id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Product" ALTER COLUMN id SET DEFAULT nextval('public."Product_id_seq"'::regclass);


--
-- Name: ProductImage id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductImage" ALTER COLUMN id SET DEFAULT nextval('public."ProductImage_id_seq"'::regclass);


--
-- Name: ProductImportRow id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductImportRow" ALTER COLUMN id SET DEFAULT nextval('public."ProductImportRow_id_seq"'::regclass);


--
-- Name: ProductVariant id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductVariant" ALTER COLUMN id SET DEFAULT nextval('public."ProductVariant_id_seq"'::regclass);


--
-- Name: Review id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Review" ALTER COLUMN id SET DEFAULT nextval('public."Review_id_seq"'::regclass);


--
-- Name: ShippingMethod id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ShippingMethod" ALTER COLUMN id SET DEFAULT nextval('public."ShippingMethod_id_seq"'::regclass);


--
-- Name: Wishlist id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Wishlist" ALTER COLUMN id SET DEFAULT nextval('public."Wishlist_id_seq"'::regclass);


--
-- Name: WishlistItem id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WishlistItem" ALTER COLUMN id SET DEFAULT nextval('public."WishlistItem_id_seq"'::regclass);


--
-- Data for Name: BlogPost; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."BlogPost" (id, title, slug, excerpt, content, "coverImage", "isPublished", "createdAt", "updatedAt", "aiGenerationStatus", "aiModel", faqs, "focusKeyword", "generatedByAI", "secondaryKeywords", "seoDescription", "seoScore", "seoTitle", "sourceProductId") FROM stdin;
\.


--
-- Data for Name: Brand; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Brand" (id, name, slug, logo, "seoTitle", "seoDescription", "createdAt", "updatedAt", "showOnHome", faqs) FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Category" (id, name, slug, "parentId", "seoTitle", "seoDescription", "createdAt", "updatedAt", image, "showOnHome", "sortOrder") FROM stdin;
\.


--
-- Data for Name: CategoryCircle; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CategoryCircle" (id, name, image, url, "sortOrder", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ContactConversation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ContactConversation" (id, "conversationId", "customerId", "guestName", "guestEmail", "guestPhone", "guestToken", category, "orderId", subject, status, priority, "assignedAdminId", source, "isReadByAdmin", "isReadByCustomer", "createdAt", "updatedAt", "lastReplyAt", "closedAt") FROM stdin;
1	cmqx6h3f20000gh1h1dokfkxz	\N	Guest User	guest@example.com	\N	856de4dc-a2f2-47c2-90c2-30a76c5e5c81	SUPPORT	\N	Live Chat Support	CLOSED	NORMAL	\N	LIVE_CHAT	f	f	2026-06-28 02:36:49.934	2026-06-28 03:37:13.739	2026-06-28 03:36:36.247	\N
2	cmqx8j2gm0002gh1h54bt94pn	2	Dashboard User		\N	b546e6c4-670f-41db-bf7f-c91d6a449cb5	Technical Support	\N	Live Chat: Technical Support	CLOSED	NORMAL	\N	LIVE_CHAT	f	f	2026-06-28 03:34:21.236	2026-07-03 10:57:18.854	2026-07-03 10:57:07.273	\N
\.


--
-- Data for Name: ContactMessage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ContactMessage" (id, "conversationId", "senderType", "senderCustomerId", "senderAdminId", body, attachment, "createdAt", "readAt") FROM stdin;
1	1	GUEST	\N	\N	hi	\N	2026-06-28 02:39:40.713	\N
2	1	ADMIN	\N	\N	yes\r\n	\N	2026-06-28 03:26:36.011	\N
3	2	CUSTOMER	2	\N	hi	\N	2026-06-28 03:35:45.46	\N
4	2	CUSTOMER	2	\N	hello	\N	2026-06-28 03:35:59.391	\N
5	1	ADMIN	\N	\N	hello\r\n	\N	2026-06-28 03:36:36.251	\N
6	2	ADMIN	\N	\N	yes\r\n	\N	2026-06-28 03:36:59.594	\N
7	2	CUSTOMER	2	\N	are you there	\N	2026-06-28 03:37:39.796	\N
8	2	ADMIN	\N	\N	yes\r\n	\N	2026-06-28 03:37:50.525	\N
9	2	ADMIN	\N	\N	ok\r\n	\N	2026-06-28 03:38:04.119	\N
10	2	CUSTOMER	2	\N	thanks	\N	2026-06-28 03:38:07.896	\N
11	2	CUSTOMER	2	\N	hi	\N	2026-07-03 10:56:33.677	\N
12	2	ADMIN	\N	\N	hi\r\n	\N	2026-07-03 10:57:02.447	\N
13	2	CUSTOMER	2	\N	hi	\N	2026-07-03 10:57:07.271	\N
\.


--
-- Data for Name: Coupon; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Coupon" (id, code, "discountType", "discountValue", "minOrderValue", "isActive", "expiresAt", "usageLimit", "usageCount", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Currency; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Currency" (id, code, name, symbol, "exchangeRate", "isDefault", "isActive", "createdAt", "updatedAt") FROM stdin;
1	CAD	CAD	$	1.0000	t	t	2026-06-23 09:08:42.16	2026-06-30 03:36:42.782
\.


--
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Customer" (id, email, "passwordHash", "firstName", "lastName", orders, "createdAt", "updatedAt", "acceptTerms", "marketingConsent", phone, "ageConfirmed", "isBlocked") FROM stdin;
1	testuser_gemini_123@example.com	$2b$10$lT/gglBZts4uQC1QlyEfwuBicP.3Ba.LRYK686GQ2/RbVqxY1IxzW	John	Doe	0	2026-06-23 04:05:35.99	2026-06-23 04:05:35.99	t	t	1234567890	f	f
2	nithurshan2018@gmail.com	$2b$10$n6jWEl0LwKjwIUkkfdgxt.2yvR2Ow7Wx0a4oUQuOEV28ggjqOt1pC	nithursan	suthakaran	0	2026-06-23 08:06:53.804	2026-06-23 08:06:53.804	t	t	0755603086	t	f
\.


--
-- Data for Name: CustomerAddress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CustomerAddress" (id, "customerId", "firstName", "lastName", company, "addressLine1", "addressLine2", city, state, "postalCode", country, "isDefaultShipping", "isDefaultBilling", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: EmailCampaign; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."EmailCampaign" (id, name, subject, status, "scheduledAt", "sentCount", "failedCount", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: EmailJob; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."EmailJob" (id, "idempotencyKey", channel, status, "recipientEmail", "customerId", "templateId", "campaignId", payload, "attemptCount", "maxAttempts", "nextAttemptAt", "providerMsgId", "errorLogs", "createdAt", "updatedAt", "sentAt") FROM stdin;
\.


--
-- Data for Name: EmailPreference; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."EmailPreference" (id, "customerId", topics, "globalUnsubscribe", "isBounced", "isSpamComplaint", "updatedAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: EmailTemplate; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."EmailTemplate" (id, name, subject, "htmlBody", "textBody", channel, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Order" (id, "orderNumber", "customerId", "customerEmail", "totalAmount", currency, status, "paymentRef", "shippingAddress", "billingAddress", "createdAt", "updatedAt", "secureToken") FROM stdin;
2	ORD-1784240196448-954	\N	atomogladi@gmail.com	210.74	CAD	PENDING	\N	{"city": "medley", "state": "fl", "country": "US", "lastName": "gladi", "firstName": "atomo", "postalCode": "33191", "addressLine1": "1962 nw 82nd ave unit 64140"}	{"city": "medley", "state": "fl", "country": "US", "lastName": "gladi", "firstName": "atomo", "postalCode": "33191", "addressLine1": "1962 nw 82nd ave unit 64140"}	2026-07-16 22:16:36.451	2026-07-16 22:16:36.451	cmro2jmn7000056ts49jtzxy1
3	ORD-1784240254358-986	\N	atomogladi@gmail.com	210.74	CAD	PENDING	\N	{"city": "medley", "state": "fl", "country": "US", "lastName": "gladi", "firstName": "atomo", "postalCode": "33191", "addressLine1": "1962 nw 82nd ave unit 64140"}	{"city": "medley", "state": "fl", "country": "US", "lastName": "gladi", "firstName": "atomo", "postalCode": "33191", "addressLine1": "1962 nw 82nd ave unit 64140"}	2026-07-16 22:17:34.36	2026-07-16 22:17:34.36	cmro2kvbr000156tsce9d8fcw
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrderItem" (id, "orderId", "productId", "variantId", title, quantity, "unitPrice", "totalPrice") FROM stdin;
1	2	5715	\N	Vulse	1	195.00	195.00
2	3	5715	\N	Vulse	1	195.00	195.00
\.


--
-- Data for Name: PaymentGateway; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PaymentGateway" (id, name, "merchantId", "publicKey", "secretKey", "isActive", "isTestMode", "updatedAt") FROM stdin;
1	Monirize	TEST-MERCHANT	\N	SECRET123	t	t	2026-06-23 04:35:56.567
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Product" (id, sku, title, slug, "shortDescription", description, status, "basePrice", "salePrice", "stockStatus", "stockQuantity", "mainImage", "seoTitle", "seoDescription", "canonicalUrl", "categoryId", "brandId", "createdAt", "updatedAt", details, faq, benefits, features, "focusKeyword", "generatedByAI", "ogDescription", "ogTitle", "productType", "readinessScore", "secondaryKeywords", specifications, tags, "validationStatus", "videoUrl", height, "isFeatured", length, "lowStockLimit", "returnInfo", "saleEndDate", "saleStartDate", "shippingInfo", "warrantyInfo", weight, width, "importBatchId", barcode) FROM stdin;
\.


--
-- Data for Name: ProductImage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductImage" (id, "productId", "imageUrl", "altText", "sortOrder", bytes, format, height, "isPrimary", "publicId", width) FROM stdin;
\.


--
-- Data for Name: ProductImportBatch; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductImportBatch" (id, filename, status, "totalRows", "successRows", "failedRows", message, "createdAt", "updatedAt", "updateMode") FROM stdin;
\.


--
-- Data for Name: ProductImportRow; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductImportRow" (id, "batchId", "rowNumber", sku, title, slug, "categorySlug", "categoryName", "brandSlug", "brandName", price, "salePrice", "stockQuantity", "imageUrl", "seoTitle", "seoDescription", "rawData", "errorMessage", "processedAt", "createdAt", barcode, "variantImage") FROM stdin;
\.


--
-- Data for Name: ProductVariant; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductVariant" (id, "productId", sku, price, "salePrice", "stockQuantity", "stockStatus", attributes, "createdAt", "updatedAt", image, "isEnabled", barcode) FROM stdin;
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Review" (id, "productId", rating, title, body, author, approved, "createdAt") FROM stdin;
\.


--
-- Data for Name: ShippingMethod; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ShippingMethod" (id, name, price, "estimatedDays", "isActive", "createdAt", "updatedAt") FROM stdin;
3	Royal Mail 1st Class	3.99	1-2 business days	t	2026-07-17 06:05:02.325	2026-07-17 06:05:02.325
4	Royal Mail Tracked 24	5.99	Next business day	t	2026-07-17 06:05:02.325	2026-07-17 06:05:02.325
5	DPD Next Day Delivery	8.99	Next business day (Guaranteed)	t	2026-07-17 06:05:02.325	2026-07-17 06:05:02.325
\.


--
-- Data for Name: StoreSettings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."StoreSettings" (id, "storeName", "storeDescription", "facebookUrl", "twitterUrl", "instagramUrl", "updatedAt", "taxEnabled", "taxIncludedInPrices", "taxRate") FROM stdin;
1	Rany.uk	Rani Fashions Design & Tailoring	https://facebook.com	https://x.com/sextoylover10	https://instagram.com	2026-07-17 05:02:34.273	f	f	0.0000
\.


--
-- Data for Name: Wishlist; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Wishlist" (id, "customerId", "createdAt", "updatedAt") FROM stdin;
1	2	2026-06-23 16:32:19.911	2026-06-23 16:32:19.911
\.


--
-- Data for Name: WishlistItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."WishlistItem" (id, "wishlistId", "productId", "variantId", "createdAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
aacdcab0-ece4-4825-833d-a352057d6582	e96325a7a58f3688cb80c5b9073b59142098d3943f549d771cc1e4df5fd9dde3	2026-06-23 01:10:28.113719+00	20260623011027_new	\N	\N	2026-06-23 01:10:27.901209+00	1
\.


--
-- Name: BlogPost_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."BlogPost_id_seq"', 18, true);


--
-- Name: Brand_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Brand_id_seq"', 745, true);


--
-- Name: CategoryCircle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."CategoryCircle_id_seq"', 8, true);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Category_id_seq"', 551, true);


--
-- Name: ContactConversation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ContactConversation_id_seq"', 2, true);


--
-- Name: ContactMessage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ContactMessage_id_seq"', 13, true);


--
-- Name: Coupon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Coupon_id_seq"', 2, true);


--
-- Name: Currency_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Currency_id_seq"', 1, true);


--
-- Name: CustomerAddress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."CustomerAddress_id_seq"', 1, false);


--
-- Name: Customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Customer_id_seq"', 2, true);


--
-- Name: EmailCampaign_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."EmailCampaign_id_seq"', 1, false);


--
-- Name: EmailJob_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."EmailJob_id_seq"', 1, false);


--
-- Name: EmailPreference_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."EmailPreference_id_seq"', 1, false);


--
-- Name: EmailTemplate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."EmailTemplate_id_seq"', 1, false);


--
-- Name: OrderItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."OrderItem_id_seq"', 2, true);


--
-- Name: Order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Order_id_seq"', 3, true);


--
-- Name: PaymentGateway_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PaymentGateway_id_seq"', 1, true);


--
-- Name: ProductImage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ProductImage_id_seq"', 42679, true);


--
-- Name: ProductImportRow_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ProductImportRow_id_seq"', 84830, true);


--
-- Name: ProductVariant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ProductVariant_id_seq"', 10117, true);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Product_id_seq"', 10071, true);


--
-- Name: Review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Review_id_seq"', 61, true);


--
-- Name: ShippingMethod_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ShippingMethod_id_seq"', 5, true);


--
-- Name: WishlistItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."WishlistItem_id_seq"', 4, true);


--
-- Name: Wishlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Wishlist_id_seq"', 1, true);


--
-- Name: BlogPost BlogPost_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_pkey" PRIMARY KEY (id);


--
-- Name: Brand Brand_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Brand"
    ADD CONSTRAINT "Brand_pkey" PRIMARY KEY (id);


--
-- Name: CategoryCircle CategoryCircle_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CategoryCircle"
    ADD CONSTRAINT "CategoryCircle_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: ContactConversation ContactConversation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContactConversation"
    ADD CONSTRAINT "ContactConversation_pkey" PRIMARY KEY (id);


--
-- Name: ContactMessage ContactMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContactMessage"
    ADD CONSTRAINT "ContactMessage_pkey" PRIMARY KEY (id);


--
-- Name: Coupon Coupon_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Coupon"
    ADD CONSTRAINT "Coupon_pkey" PRIMARY KEY (id);


--
-- Name: Currency Currency_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Currency"
    ADD CONSTRAINT "Currency_pkey" PRIMARY KEY (id);


--
-- Name: CustomerAddress CustomerAddress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CustomerAddress"
    ADD CONSTRAINT "CustomerAddress_pkey" PRIMARY KEY (id);


--
-- Name: Customer Customer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_pkey" PRIMARY KEY (id);


--
-- Name: EmailCampaign EmailCampaign_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EmailCampaign"
    ADD CONSTRAINT "EmailCampaign_pkey" PRIMARY KEY (id);


--
-- Name: EmailJob EmailJob_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EmailJob"
    ADD CONSTRAINT "EmailJob_pkey" PRIMARY KEY (id);


--
-- Name: EmailPreference EmailPreference_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EmailPreference"
    ADD CONSTRAINT "EmailPreference_pkey" PRIMARY KEY (id);


--
-- Name: EmailTemplate EmailTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EmailTemplate"
    ADD CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: PaymentGateway PaymentGateway_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PaymentGateway"
    ADD CONSTRAINT "PaymentGateway_pkey" PRIMARY KEY (id);


--
-- Name: ProductImage ProductImage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_pkey" PRIMARY KEY (id);


--
-- Name: ProductImportBatch ProductImportBatch_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductImportBatch"
    ADD CONSTRAINT "ProductImportBatch_pkey" PRIMARY KEY (id);


--
-- Name: ProductImportRow ProductImportRow_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductImportRow"
    ADD CONSTRAINT "ProductImportRow_pkey" PRIMARY KEY (id);


--
-- Name: ProductVariant ProductVariant_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductVariant"
    ADD CONSTRAINT "ProductVariant_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: ShippingMethod ShippingMethod_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ShippingMethod"
    ADD CONSTRAINT "ShippingMethod_pkey" PRIMARY KEY (id);


--
-- Name: StoreSettings StoreSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StoreSettings"
    ADD CONSTRAINT "StoreSettings_pkey" PRIMARY KEY (id);


--
-- Name: WishlistItem WishlistItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_pkey" PRIMARY KEY (id);


--
-- Name: Wishlist Wishlist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Wishlist"
    ADD CONSTRAINT "Wishlist_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: BlogPost_isPublished_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "BlogPost_isPublished_idx" ON public."BlogPost" USING btree ("isPublished");


--
-- Name: BlogPost_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "BlogPost_slug_idx" ON public."BlogPost" USING btree (slug);


--
-- Name: BlogPost_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "BlogPost_slug_key" ON public."BlogPost" USING btree (slug);


--
-- Name: BlogPost_sourceProductId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "BlogPost_sourceProductId_idx" ON public."BlogPost" USING btree ("sourceProductId");


--
-- Name: Brand_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Brand_slug_key" ON public."Brand" USING btree (slug);


--
-- Name: Category_parentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Category_parentId_idx" ON public."Category" USING btree ("parentId");


--
-- Name: Category_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Category_slug_key" ON public."Category" USING btree (slug);


--
-- Name: ContactConversation_conversationId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ContactConversation_conversationId_key" ON public."ContactConversation" USING btree ("conversationId");


--
-- Name: ContactConversation_customerId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ContactConversation_customerId_idx" ON public."ContactConversation" USING btree ("customerId");


--
-- Name: ContactConversation_guestEmail_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ContactConversation_guestEmail_idx" ON public."ContactConversation" USING btree ("guestEmail");


--
-- Name: ContactConversation_guestToken_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ContactConversation_guestToken_idx" ON public."ContactConversation" USING btree ("guestToken");


--
-- Name: ContactConversation_guestToken_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ContactConversation_guestToken_key" ON public."ContactConversation" USING btree ("guestToken");


--
-- Name: ContactConversation_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ContactConversation_status_idx" ON public."ContactConversation" USING btree (status);


--
-- Name: ContactMessage_conversationId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ContactMessage_conversationId_idx" ON public."ContactMessage" USING btree ("conversationId");


--
-- Name: Coupon_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Coupon_code_idx" ON public."Coupon" USING btree (code);


--
-- Name: Coupon_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Coupon_code_key" ON public."Coupon" USING btree (code);


--
-- Name: Currency_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Currency_code_key" ON public."Currency" USING btree (code);


--
-- Name: CustomerAddress_customerId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "CustomerAddress_customerId_idx" ON public."CustomerAddress" USING btree ("customerId");


--
-- Name: Customer_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Customer_email_idx" ON public."Customer" USING btree (email);


--
-- Name: Customer_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Customer_email_key" ON public."Customer" USING btree (email);


--
-- Name: EmailJob_idempotencyKey_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "EmailJob_idempotencyKey_idx" ON public."EmailJob" USING btree ("idempotencyKey");


--
-- Name: EmailJob_idempotencyKey_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "EmailJob_idempotencyKey_key" ON public."EmailJob" USING btree ("idempotencyKey");


--
-- Name: EmailJob_recipientEmail_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "EmailJob_recipientEmail_idx" ON public."EmailJob" USING btree ("recipientEmail");


--
-- Name: EmailJob_status_nextAttemptAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "EmailJob_status_nextAttemptAt_idx" ON public."EmailJob" USING btree (status, "nextAttemptAt");


--
-- Name: EmailPreference_customerId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "EmailPreference_customerId_key" ON public."EmailPreference" USING btree ("customerId");


--
-- Name: EmailTemplate_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "EmailTemplate_name_key" ON public."EmailTemplate" USING btree (name);


--
-- Name: OrderItem_orderId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "OrderItem_orderId_idx" ON public."OrderItem" USING btree ("orderId");


--
-- Name: Order_customerId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Order_customerId_idx" ON public."Order" USING btree ("customerId");


--
-- Name: Order_orderNumber_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Order_orderNumber_idx" ON public."Order" USING btree ("orderNumber");


--
-- Name: Order_orderNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Order_orderNumber_key" ON public."Order" USING btree ("orderNumber");


--
-- Name: Order_paymentRef_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Order_paymentRef_key" ON public."Order" USING btree ("paymentRef");


--
-- Name: Order_secureToken_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Order_secureToken_key" ON public."Order" USING btree ("secureToken");


--
-- Name: Order_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Order_status_idx" ON public."Order" USING btree (status);


--
-- Name: PaymentGateway_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PaymentGateway_name_key" ON public."PaymentGateway" USING btree (name);


--
-- Name: ProductImage_productId_sortOrder_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ProductImage_productId_sortOrder_idx" ON public."ProductImage" USING btree ("productId", "sortOrder");


--
-- Name: ProductImportRow_batchId_errorMessage_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ProductImportRow_batchId_errorMessage_idx" ON public."ProductImportRow" USING btree ("batchId", "errorMessage");


--
-- Name: ProductImportRow_batchId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ProductImportRow_batchId_idx" ON public."ProductImportRow" USING btree ("batchId");


--
-- Name: ProductImportRow_sku_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ProductImportRow_sku_idx" ON public."ProductImportRow" USING btree (sku);


--
-- Name: ProductVariant_price_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ProductVariant_price_idx" ON public."ProductVariant" USING btree (price);


--
-- Name: ProductVariant_productId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ProductVariant_productId_idx" ON public."ProductVariant" USING btree ("productId");


--
-- Name: ProductVariant_sku_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ProductVariant_sku_key" ON public."ProductVariant" USING btree (sku);


--
-- Name: ProductVariant_stockStatus_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ProductVariant_stockStatus_idx" ON public."ProductVariant" USING btree ("stockStatus");


--
-- Name: Product_brandId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Product_brandId_status_idx" ON public."Product" USING btree ("brandId", status);


--
-- Name: Product_categoryId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Product_categoryId_status_idx" ON public."Product" USING btree ("categoryId", status);


--
-- Name: Product_sku_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Product_sku_key" ON public."Product" USING btree (sku);


--
-- Name: Product_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Product_slug_key" ON public."Product" USING btree (slug);


--
-- Name: Product_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Product_status_idx" ON public."Product" USING btree (status);


--
-- Name: Product_updatedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Product_updatedAt_idx" ON public."Product" USING btree ("updatedAt");


--
-- Name: Review_productId_approved_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Review_productId_approved_idx" ON public."Review" USING btree ("productId", approved);


--
-- Name: WishlistItem_wishlistId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "WishlistItem_wishlistId_idx" ON public."WishlistItem" USING btree ("wishlistId");


--
-- Name: WishlistItem_wishlistId_productId_variantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "WishlistItem_wishlistId_productId_variantId_key" ON public."WishlistItem" USING btree ("wishlistId", "productId", "variantId");


--
-- Name: Wishlist_customerId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Wishlist_customerId_key" ON public."Wishlist" USING btree ("customerId");


--
-- Name: BlogPost BlogPost_sourceProductId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_sourceProductId_fkey" FOREIGN KEY ("sourceProductId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Category Category_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ContactConversation ContactConversation_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContactConversation"
    ADD CONSTRAINT "ContactConversation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ContactMessage ContactMessage_conversationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContactMessage"
    ADD CONSTRAINT "ContactMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES public."ContactConversation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CustomerAddress CustomerAddress_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CustomerAddress"
    ADD CONSTRAINT "CustomerAddress_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EmailJob EmailJob_campaignId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EmailJob"
    ADD CONSTRAINT "EmailJob_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES public."EmailCampaign"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: EmailJob EmailJob_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EmailJob"
    ADD CONSTRAINT "EmailJob_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: EmailJob EmailJob_templateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EmailJob"
    ADD CONSTRAINT "EmailJob_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES public."EmailTemplate"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: EmailPreference EmailPreference_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EmailPreference"
    ADD CONSTRAINT "EmailPreference_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductImage ProductImage_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductImportRow ProductImportRow_batchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductImportRow"
    ADD CONSTRAINT "ProductImportRow_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES public."ProductImportBatch"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductVariant ProductVariant_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductVariant"
    ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Product Product_brandId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public."Brand"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Product Product_importBatchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_importBatchId_fkey" FOREIGN KEY ("importBatchId") REFERENCES public."ProductImportBatch"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Review Review_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WishlistItem WishlistItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WishlistItem WishlistItem_wishlistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES public."Wishlist"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Wishlist Wishlist_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Wishlist"
    ADD CONSTRAINT "Wishlist_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict cksDmHfsUGR5sP0Q5QQ2PWBQgOZENJGMRWe4wCfww0PCBPfMrCjh5QIOMh3fhre


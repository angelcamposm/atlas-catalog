<?php

declare(strict_types=1);

use App\Enums\BusinessDomainCategory;

return [
    // --- Core Domains ---
    [
        'name' => 'Sales',
        'description' => 'Manages the entire sales lifecycle, from lead generation and opportunity tracking to quotes and converting leads into customers.',
        'category' => BusinessDomainCategory::Core,
        'parent_domain' => null,
    ],
    [
        'name' => 'Orders',
        'description' => 'Handles customer purchase orders, including creation, modification, tracking, and fulfillment status.',
        'category' => BusinessDomainCategory::Core,
        'parent_domain' => null,
    ],
    [
        'name' => 'Customers',
        'description' => 'Manages customer information, including personal data, company profiles, account status, and contact history.',
        'category' => BusinessDomainCategory::Core,
        'parent_domain' => null,
    ],
    [
        'name' => 'Products',
        'description' => 'Manages the master catalog of all products and services offered, including pricing, SKU, description, and categories.',
        'category' => BusinessDomainCategory::Core,
        'parent_domain' => null,
    ],
    [
        'name' => 'Content',
        'description' => 'Manages the creation, approval, and lifecycle of business-specific content (e.g., articles, videos, posts).',
        'category' => BusinessDomainCategory::Core,
        'parent_domain' => null,
    ],

    // --- Supporting Domains ---
    [
        'name' => 'Billing & Invoicing',
        'description' => 'Responsible for generating invoices, processing payments, managing subscriptions, and handling credit memos.',
        'category' => BusinessDomainCategory::Supporting,
        'parent_domain' => null,
    ],
    [
        'name' => 'Inventory',
        'description' => 'Tracks stock levels, manages warehouse locations, handles stock adjustments, and forecasts inventory needs.',
        'category' => BusinessDomainCategory::Supporting,
        'parent_domain' => null,
    ],
    [
        'name' => 'Shipping & Fulfillment',
        'description' => 'Manages the logistics of picking, packing, and shipping orders to customers, including carrier integration and label generation.',
        'category' => BusinessDomainCategory::Supporting,
        'parent_domain' => 'Orders',
    ],
    [
        'name' => 'Marketing',
        'description' => 'Manages marketing campaigns, email lists, promotions, discount codes, and customer segmentation.',
        'category' => BusinessDomainCategory::Supporting,
        'parent_domain' => null,
    ],
    [
        'name' => 'Reporting & Analytics',
        'description' => 'Aggregates data from other domains to generate business intelligence, reports, and dashboards.',
        'category' => BusinessDomainCategory::Supporting,
        'parent_domain' => null,
    ],
    [
        'name' => 'Support & Ticketing',
        'description' => 'Manages customer support requests, help desk tickets, and the knowledge base.',
        'category' => BusinessDomainCategory::Supporting,
        'parent_domain' => 'Customers',
    ],
    [
        'name' => 'Catalog',
        'description' => 'A specialized subdomain that handles the *presentation* of product data, often separate from the master product domain.',
        'category' => BusinessDomainCategory::Supporting,
        'parent_domain' => 'Products',
    ],
    [
        'name' => 'Pricing',
        'description' => 'Manages a complex pricing engine, applying rules, discounts, and customer-specific pricing.',
        'category' => BusinessDomainCategory::Supporting,
        'parent_domain' => 'Products',
    ],
    [
        'name' => 'Procurement',
        'description' => 'Manages purchasing of raw materials or goods from suppliers, including purchase orders and vendor management.',
        'category' => BusinessDomainCategory::Supporting,
        'parent_domain' => 'Inventory',
    ],
    [
        'name' => 'Returns (RMA)',
        'description' => 'Manages the Return Merchandise Authorization process, tracking returned items, issuing refunds, and restocking.',
        'category' => BusinessDomainCategory::Supporting,
        'parent_domain' => 'Orders',
    ],

    // --- Generic Domains ---
    [
        'name' => 'Identity & Access',
        'description' => 'Handles user authentication (login/logout), authorization (permissions/roles), and user profile management.',
        'category' => BusinessDomainCategory::Generic,
        'parent_domain' => null,
    ],
    [
        'name' => 'Payments',
        'description' => 'Integrates with payment gateways to process transactions, handle refunds, and manage payment methods.',
        'category' => BusinessDomainCategory::Generic,
        'parent_domain' => 'Billing & Invoicing',
    ],
    [
        'name' => 'Notifications',
        'description' => 'A centralized service for sending communications like emails, SMS, and push notifications to users.',
        'category' => BusinessDomainCategory::Generic,
        'parent_domain' => null,
    ],
    [
        'name' => 'Compliance',
        'description' => 'Ensures all operations adhere to legal and regulatory standards, such as GDPR, HIPAA, or financial regulations.',
        'category' => BusinessDomainCategory::Generic,
        'parent_domain' => null,
    ],
    [
        'name' => 'Human Resources (HR)',
        'description' => 'Manages employee data, payroll, benefits, recruiting, and onboarding. Often a COTS (Commercial Off-The-Shelf) system.',
        'category' => BusinessDomainCategory::Generic,
        'parent_domain' => null,
    ],
    [
        'name' => 'Payroll',
        'description' => 'Calculates and processes employee salaries, taxes, and deductions.',
        'category' => BusinessDomainCategory::Generic,
        'parent_domain' => 'Human Resources (HR)',
    ],
    [
        'name' => 'Finance (Accounting)',
        'description' => 'Manages the general ledger, accounts payable (AP), accounts receivable (AR), and financial reporting.',
        'category' => BusinessDomainCategory::Generic,
        'parent_domain' => null,
    ],
    [
        'name' => 'Content Management (CMS)',
        'description' => 'Manages generic web content, like landing pages, blog posts, and marketing copy. Distinct from a core content domain.',
        'category' => BusinessDomainCategory::Generic,
        'parent_domain' => null,
    ],
    [
        'name' => 'Auditing',
        'description' => 'Logs critical business events and user actions from all other domains for security and compliance tracking.',
        'category' => BusinessDomainCategory::Generic,
        'parent_domain' => null,
    ],
];

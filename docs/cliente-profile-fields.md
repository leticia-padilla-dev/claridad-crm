# Cliente Profile Fields

## Purpose

This document defines the minimum client profile for Claridad CRM V1.

It answers three questions:

1. what a client represents in Claridad CRM
2. which fields are safe to include in the base profile now
3. which fields must stay out until `orders` or `opportunities` are designed

## Core Decision

```txt
A client in Claridad CRM V1 is a person.
The base client profile stores stable relationship data.
It does not store transactional or opportunity-derived outcomes.
```

This means:

- `contacts` remain the core person-level entity
- the client profile must work across Mary Kay, Beyond Beauty and In Cruises
- the client profile must not absorb data that belongs to `orders` or `opportunities`

## What A Client Is

In Claridad CRM V1, a client is:

- a person
- someone who may interact with one or more business lines
- someone who may later generate orders, opportunities, appointments and follow-ups

A client is not:

- a company
- a household account
- a business line
- an order
- an opportunity

## Profile Design Principles

1. Keep the base profile person-centric.
2. Keep the profile stable across all business lines.
3. Store interests and preferences, not commercial outcomes.
4. Reuse current `contacts` structure where reasonable.
5. Do not add purchase-derived fields before `orders` exist.
6. Do not force In Cruises needs into product-sale semantics.

## Current `contacts` Model

The current Atomic model already provides these relevant fields:

- `first_name`
- `last_name`
- `email_jsonb`
- `phone_jsonb`
- `background`
- `status`
- `tags`
- `sales_id`

It also includes inherited B2B-oriented fields:

- `title`
- `company_id`
- `linkedin_url`
- `has_newsletter`
- `gender`

These inherited fields can remain technically available, but they are not part of the minimum Claridad CRM V1 client profile.

## Minimum V1 Client Fields

These are the approved minimum profile fields for Claridad CRM V1.

| Field | Purpose | Recommendation |
| --- | --- | --- |
| `first_name` | person identity | keep |
| `last_name` | person identity | keep |
| `whatsapp` | primary direct contact channel | introduce conceptually now |
| `email_jsonb` | email contact data | keep |
| `city` | local context and segmentation | introduce |
| `birthday` | client relationship and follow-up | introduce |
| `preferences` | likes, style, beauty or trip preferences | introduce |
| `allergies_or_needs` | care notes, sensitivities or special needs | introduce |
| `client_status` | relationship/commercial state | reuse or evolve current `status` |
| `business_lines_interest` | relation to Mary Kay, Beyond Beauty and In Cruises | introduce |
| `sales_id` | owner or responsible seller | keep |
| `background` | open contextual notes | keep as freeform support field |

## Field Semantics

### `whatsapp`

Purpose:

- capture the primary WhatsApp contact channel

Why it matters:

- direct messaging is likely more important than generic phone data for this business

Implementation guidance later:

- the UX should expose it as a first-class field
- implementation may reuse `phone_jsonb` or introduce a dedicated field later
- the important decision now is semantic, not storage-specific

### `city`

Purpose:

- support local coordination, segmentation and delivery or meeting context

Why it matters:

- relevant to physical delivery, local beauty follow-up and appointment planning

### `birthday`

Purpose:

- support relationship-based follow-up

Why it matters:

- useful for beauty, repeat-sales and loyalty communication

### `preferences`

Purpose:

- store freeform personal preferences relevant to beauty, wellness or travel

Examples:

- preferred textures
- skin routine habits
- favorite trip styles

Why it matters:

- this is stable profile context, not transactional history

### `allergies_or_needs`

Purpose:

- capture health, sensitivity or special handling considerations

Examples:

- skin sensitivity
- fragrance intolerance
- specific travel needs

Why it matters:

- this is important profile context that applies before any order exists

### `client_status`

Purpose:

- represent the current relationship or commercial state of the person

Recommendation:

- reuse the current `contacts.status` field in V1

Why:

- it already exists in the model
- it avoids premature schema work
- it is good enough for a first controlled iteration

Important constraint:

- this field should be interpreted as client relationship status, not as B2B account status

### `business_lines_interest`

Purpose:

- represent which business lines are relevant for the client

Why it matters:

- a client may be interested in one line only
- a client may be active in multiple lines
- this is the cleanest bridge between the shared client profile and later domain-specific flows

Recommended conceptual values:

- `mary-kay`
- `beyond-beauty`
- `incruises`

Important constraint:

- this should not be modeled as generic tags in the conceptual design
- it belongs to profile structure, not ad hoc segmentation

### `background`

Purpose:

- keep flexible contextual notes about the person

Why keep it:

- the field already exists
- it is useful for human context that does not deserve a dedicated structured field yet

Examples:

- how the relationship started
- communication preferences
- personal context worth remembering

## Mapping To The Current Atomic Model

### Safe reuse now

These existing fields can remain part of the base profile:

- `first_name`
- `last_name`
- `email_jsonb`
- `phone_jsonb`
- `background`
- `status`
- `sales_id`
- `tags` for generic segmentation

### Not part of the minimum profile

These current fields are not central to Claridad CRM V1's minimum client definition:

- `title`
- `company_id`
- `linkedin_url`
- `has_newsletter`
- `gender`

They may remain technically present, but they should not drive the conceptual client profile.

### Recommended treatment

- `title` and `company_id`: legacy B2B-compatible data, optional at most
- `linkedin_url`: optional enrichment, not core
- `has_newsletter`: communication preference, but not core to the minimum profile
- `gender`: optional only, not central to the model

## Fields Explicitly Excluded For Now

The following fields are out of scope for the minimum client profile:

- `last_purchase_at`
- `favorite_products`
- `purchase_history`
- recurring products
- order totals
- payment behavior
- travel budget stage
- expected travel date as opportunity state

These are excluded because they depend on downstream domain entities.

### Order-dependent exclusions

These must wait for `orders`:

- `last_purchase_at`
- `favorite_products`
- purchase history
- recurring products

### Opportunity-dependent exclusions

These must wait for `opportunities`:

- travel intent stage
- estimated budget
- target travel dates
- opportunity probability

## Recommended Next-Step Implementation Rules

1. The next implementation slice should only add fields approved here.
2. `business_lines_interest` must be treated as a structured concept, not a loose tag substitute.
3. `client_status` should initially reuse current `contacts.status`.
4. `title` and `company_id` should not be part of the minimum client-first UX.
5. No field derived from `orders` or `opportunities` should enter the profile slice.

## Summary

Claridad CRM V1 should define the client profile like this:

```txt
client = person-level core record
profile = stable relationship context
business_lines_interest = transversal commercial context
orders and opportunities stay outside the base profile
```

This keeps the client model clean, implementation-ready and aligned with the real operating shape of YoliSkincare.

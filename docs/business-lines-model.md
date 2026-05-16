# Business Lines Model

## Purpose

This document defines the conceptual business-line model for Claridad CRM.

Claridad CRM does not support a single homogeneous business. It supports several lines with different operational outcomes:

- Mary Kay
- Beyond Beauty
- In Cruises

Because of that, the system must distinguish between:

- a shared customer relationship layer
- transactional outcomes
- commercial opportunity outcomes

## Core Decision

```txt
business_line is a transversal business dimension.
orders are transactional outcomes.
opportunities are commercial outcomes.
```

This means:

- not every customer interaction ends in an order
- not every line should be modeled as product sales
- In Cruises must not be forced into `orders`

## What `business_line` Means

`business_line` identifies the commercial context in which a customer relationship, follow-up, appointment, catalog, order or opportunity exists.

It is not:

- a customer type
- a task type
- a product category
- a replacement for `orders`
- a replacement for `opportunities`

It is a transversal classifier that helps the system understand which operational path applies.

## Initial Supported Business Lines

### Mary Kay

Nature:

- physical beauty products
- repeat clients
- delivery-oriented operations

Typical outcomes:

- orders
- follow-ups
- appointments
- catalog sharing

Likely future needs:

- stock
- delivery state
- beauty routines
- skin-type recommendations

### Beyond Beauty

Nature:

- beauty and wellness
- personalized recommendations
- lighter catalog or experience-based commercial flow

Typical outcomes:

- follow-ups
- appointments
- catalog links
- campaigns
- orders when a real purchase exists

Likely future needs:

- recommendation history
- habit or routine tracking
- campaign-specific links

### In Cruises

Nature:

- travel membership and advisory sales
- budget and travel-intent driven
- commercial guidance rather than local fulfillment

Typical outcomes:

- opportunities
- appointments
- follow-ups
- documentation or link sharing

Likely future needs:

- travel preferences
- estimated budget
- destination or trip type
- target dates
- commercial stage

## Entity Impact

### Contacts

`contacts` remain the person-level core entity and are shown as clients.

Business-line impact:

- a client may belong to one or more business lines
- the client profile should store business-line interest, not transactional outcomes
- client fields must stay generic enough to serve all lines

Safe examples:

- whatsapp
- city
- birthday
- preferences
- allergies_or_needs
- client_status
- business_lines_interest

Not safe yet:

- last_purchase_at
- favorite_products
- purchase_history

Those depend on downstream entities such as `orders`.

### Tasks

`tasks` can serve as follow-ups across all business lines.

Business-line impact:

- tasks should remain generic
- business-line context may later be attached or inferred from the related client or record

### Appointments

Appointments are shared across all lines.

Business-line impact:

- Mary Kay: product consultation or delivery meeting
- Beyond Beauty: skincare or wellness consultation
- In Cruises: advisory session or travel planning call

### Catalog Links

Catalog links are most relevant to Mary Kay and Beyond Beauty, but may also support In Cruises as documentation or offer-sharing.

Business-line impact:

- not every line needs the same catalog format
- the entity should stay generic enough for links, campaigns and supporting materials

### Orders

Orders are a transactional entity.

They apply to:

- Mary Kay
- Beyond Beauty when a real purchase occurs

They do not apply to:

- In Cruises as a core modeling path

Business-line impact:

- the entity must support business-line attribution
- the entity must remain clearly transactional
- the entity should not absorb commercial advisory states

### Opportunities

Opportunities are a commercial entity.

They apply especially to:

- In Cruises

They may later also support:

- high-touch advisory flows in other lines, if needed

Business-line impact:

- the entity must support budget, intent, timing and commercial stage
- it must remain distinct from orders

## Orders vs Opportunities

This distinction is mandatory.

### Orders

Use `orders` when the outcome is a transaction such as:

- product purchase
- payment follow-up
- delivery or fulfillment tracking

Orders answer:

- what was bought
- when
- for how much
- what is the payment or delivery state

### Opportunities

Use `opportunities` when the outcome is a commercial possibility such as:

- advisory sale
- trip interest
- estimated budget conversation
- future purchase possibility

Opportunities answer:

- what the client is considering
- when they may act
- what budget or timing exists
- what commercial stage the lead is in

### Hard Boundary

```txt
In Cruises belongs to opportunities, not orders.
```

If a future workflow eventually involves payment or booking-related downstream records, that should be modeled later without collapsing the opportunity layer into product-style orders.

## Modeling Options for `business_line`

These are the main implementation strategies to evaluate later.

### Option 1: Enum

Pros:

- simple
- fast to implement
- clear validation

Cons:

- rigid
- harder to evolve without schema changes

Best fit:

- very early V1 with fixed known lines

### Option 2: Table

Pros:

- extensible
- can support labels, status, metadata and admin management later

Cons:

- more setup
- more wiring

Best fit:

- medium-term model if the business may grow or lines may change

### Option 3: Configuration

Pros:

- lighter than a full table
- potentially admin-editable

Cons:

- validation can be weaker
- may become ambiguous if reused too broadly

Best fit:

- controlled V1.5 style evolution

### Option 4: Tags

Pros:

- zero-friction

Cons:

- semantically weak
- easy to misuse
- poor long-term foundation for routing logic or analytics

Best fit:

- not recommended as the main business-line model

### Option 5: Future reuse of `companies`

Pros:

- existing Atomic structure already exists

Cons:

- semantically confusing
- `companies` currently represent B2B account logic, not business lines
- high risk of forcing the old CRM model back into the new domain

Best fit:

- not recommended for V1

## Recommended Direction

For now, the correct decision is:

```txt
define business_line conceptually now
delay implementation detail choice
do not overload tags or companies
keep the model open until cliente fields and opportunities are designed
```

If a forced short-term implementation choice becomes necessary, the safest temporary direction is:

- conceptual support now
- implementation later as enum or small controlled configuration
- table only when broader flexibility is truly needed

## Operational Rules

1. Every new domain slice must declare whether it is shared across all business lines or specific to one.
2. Any field derived from transactions must wait until `orders` are designed.
3. Any advisory or travel-intent flow must go through `opportunities`, not `orders`.
4. `business_line` must stay explicit in future domain design discussions.
5. `companies` must not be reused as business lines in V1.

## Summary

Claridad CRM V1 should be understood like this:

```txt
clients, follow-ups and appointments are shared operational foundations
business_line defines the commercial context
orders are transactional outputs
opportunities are commercial outputs
In Cruises belongs to opportunities, not orders
```

This model keeps Claridad CRM aligned with the real structure of YoliSkincare without forcing incompatible business lines into the same transactional shape.

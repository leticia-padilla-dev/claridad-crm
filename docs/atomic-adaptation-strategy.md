# Atomic CRM Adaptation Strategy

## Purpose

This document fixes the technical strategy for adapting Atomic CRM into Claridad CRM without forcing a premature domain rewrite.

The goal is to use Atomic CRM as an operational shell for a lightweight commercial system, not as a neutral order-management foundation.

## Core Decision

```txt
Atomic CRM serves as a visual and operational base.
Atomic CRM does not serve as a neutral orders domain.
```

Because of that:

- `contacts` can be kept internally and shown as `Clientes` when cliente means person
- `companies` should be hidden in V1
- `deals` should be hidden in V1
- `deals` must not be reused as transactional `orders`
- real `orders` must be introduced later as a new entity

## Why This Strategy

Atomic CRM already provides:

- auth and session handling
- app shell and routing structure
- resource-based screens
- list, form and detail patterns
- notes, tasks and tagging foundations
- Supabase integration patterns

Atomic CRM is not a neutral base because `contacts`, `companies` and `deals` are already shaped around a B2B CRM model.

The main risk is no longer choosing the wrong base. The main risk is introducing too much new domain too early and forcing false semantics into the current model.

## Domain Decisions

### Current entities

| Atomic entity | Claridad V1 decision |
| --- | --- |
| `contacts` | keep internally, show as `Clientes` |
| `companies` | hide in V1 |
| `deals` | hide in V1 |
| `tasks` | keep, show as `Seguimientos` later |
| `notes` | keep |
| `tags` | keep |

### Future entities

These should be introduced as new domain entities instead of forcing the existing CRM model:

- `orders`
- `catalog_links`
- `appointments`

### Hard rule

```txt
Nothing that depends on orders enters the model before orders are designed.
```

This especially applies to:

- `last_purchase_at`
- `favorite_products`
- purchase history
- recurring products

Those should be derived later from a real orders model, not introduced early as manual contact fields.

## V1 Scope

Claridad CRM V1 should first become a simplified client and follow-up system.

The initial visible surface should move toward:

- `Clientes`
- `Seguimientos`
- `Notas`

And away from:

- `Companies`
- `Deals`
- B2B pipeline language

## What V1 Does Not Try To Solve

V1 does not try to:

- convert Atomic CRM into a full ERP
- redesign the whole database up front
- rename all internal tables immediately
- reuse `deals` as real `orders`
- add advanced analytics early
- mix multiple domain changes into one branch

## Implementation Principles

The adaptation should follow these principles:

1. Keep internal names stable until the product direction is validated.
2. Change visible surface before changing deep schema.
3. Hide mismatched B2B concepts before replacing them.
4. Add new entities only when their domain is clearly defined.
5. Prefer narrow slices over broad refactors.
6. Preserve auth, routing and the base architecture unless a slice explicitly requires otherwise.

## Recommended Slice Order

### Phase 1: Direction and visible simplification

1. `docs/atomic-adaptation-strategy`
2. `ui/clientes-visible-surface`

### Phase 2: Minimal client profile

3. `domain/define-cliente-profile-fields`
4. `domain/implement-cliente-core-profile-fields`

Safe candidate fields for the first client profile slice:

- `whatsapp`
- `city`
- `birthday`
- `preferences`
- `allergies_or_needs`
- `client_status`

### Phase 3: Orders design before implementation

5. `domain/design-orders-model`
6. `domain/add-orders-schema-and-provider-wiring`
7. `ui/add-orders-resource-basic-screens`

### Phase 4: Supporting domain slices

8. `ui/relabel-tasks-as-seguimientos`
9. `domain/catalog-links`
10. `domain/appointments`
11. `dashboard/yoli-v1`

## Backlog Guidance

The following backlog adjustments are recommended:

- split broad domain slices before implementation
- do not implement client fields derived from orders yet
- keep task relabeling as a UI slice unless a separate domain decision is approved
- treat `orders` as a multi-slice initiative, not as a single table addition

## Risk Management

Main risks:

- broad slices that mix documentation, UI and domain changes
- introducing order-dependent fields before designing orders
- renaming internal structures too early
- keeping B2B screens visible while claiming a new domain

Preferred mitigation:

- define scope in the issue first
- keep one objective per branch
- validate each slice independently
- postpone schema changes until the domain decision is stable

## Summary

The correct adaptation path is:

```txt
first simplify the visible product
then define the new domain carefully
then add real business entities
then derive richer behavior from those entities
```

Atomic CRM should be treated as the shell that accelerates Claridad CRM, not as the final domain model.

---
title: "Debug playbook"
date: 2026-05-21
tags: ["debug", "checklist"]
---

# Debug playbook

## First pass

1. Reproduce the issue.
2. Capture logs.
3. Reduce the scope.

## Checklist

- [ ] Confirm environment variables.
- [ ] Check recent deploys.
- [ ] Validate inputs.

## Code sample

```ts
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export function parseJson(input: string): Result<unknown> {
  try {
    return { ok: true, value: JSON.parse(input) };
  } catch (error) {
    return { ok: false, error: "Invalid JSON" };
  }
}
```

## Quote

> Measure twice, cut once.

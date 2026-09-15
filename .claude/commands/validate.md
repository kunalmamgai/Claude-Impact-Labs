# Validate changes

Run the project checks required for this repo:

```bash
npx tsx --test lib/*.test.ts
npm run build
```

If the change affects eligibility logic, make sure the new behavior is covered by a test and that unknown evidence remains non-pass.

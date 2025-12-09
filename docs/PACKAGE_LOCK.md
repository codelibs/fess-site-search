# Package Lock File

This project currently uses `npm install` instead of `npm ci` to support builds without a committed `package-lock.json` file.

## For Production Deployments

For more deterministic builds in production, it's recommended to generate and commit `package-lock.json`:

```bash
cd fss/
npm install
git add package-lock.json
git commit -m "Add package-lock.json for deterministic builds"
```

## Why package-lock.json is not committed

The original project excluded `package-lock.json` from version control. While this is generally not recommended for production applications, it was maintained during modernization to preserve the original behavior.

## Benefits of Committing package-lock.json

- **Deterministic builds**: Exact same dependency versions across all environments
- **Faster CI builds**: `npm ci` is faster than `npm install`
- **Security**: Easier to track and audit exact dependency versions
- **Reliability**: Prevents unexpected breakage from dependency updates

## Migration Path

To migrate to using `package-lock.json`:

1. Generate the lock file:
   ```bash
   cd fss/
   npm install
   ```

2. Update Dockerfile (both occurrences):
   ```dockerfile
   # Change from:
   RUN npm install --no-audit

   # To:
   COPY fss/package-lock.json ./
   RUN npm ci --no-audit
   ```

3. Update GitHub Actions workflow:
   ```yaml
   # Change from:
   cache-dependency-path: fss/package.json
   run: npm install

   # To:
   cache-dependency-path: fss/package-lock.json
   run: npm ci
   ```

4. Remove from `.gitignore` if present:
   ```bash
   # Make sure *package-lock.json is NOT in .gitignore
   ```

5. Commit the changes:
   ```bash
   git add fss/package-lock.json Dockerfile .github/workflows/test.yml
   git commit -m "Use package-lock.json for deterministic builds"
   ```

# Project TODO

## Fix Railway Deployment Migration Error
- [x] Fix duplicate enum type error in migrations (role and tier enums already exist)
- [x] Update migration script to handle existing enum types gracefully
- [x] Deploy fix to Railway and verify deployment succeeds
- [ ] Test prediction generation on Railway production

## Debug Prediction Query Failure on Railway
- [x] Get error details from user (browser console, error message)
- [x] Check if OpenAI API key is set in Railway
- [x] Verify database connection for saving predictions
- [x] Test prediction generation locally
- [x] Fix identified issue (added prepare: false to postgres connection)
- [ ] Verify predictions work in production (blocked by migration error)

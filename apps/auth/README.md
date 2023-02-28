# Membership protocol auth handler

This website handles authentication similar to the Oath flow.

## Proposed authentication flow
- User requests login
- Backend redirects user to auth handler app and sets URL parameters
    - `adminAddres` 
    - `membershipDefinitionId` 
    - `callbackUrl` - URL to use for redirection on authentication completion
- User completes login form (connects wallet, signs an auth message)
- Auth handler app redirects user back to the URL provided in `callbackUrl`. It also sets the following params:
    - `message`
    - `signature`
- Backend authorizes the received message/signature and checks if user account holds a membership NFT
- Authentication successful/failed

Example URL: http://localhost:3000/?adminAddress=0xf8d6e0586b0a20c7&membershipDefinitionId=0&callbackUrl=http://localhost:3004/callback

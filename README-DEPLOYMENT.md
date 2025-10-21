# Multi-Tenant SaaS Platform - Deployment Guide

## Architecture Overview

This multi-tenant SaaS platform consists of:

1. **Backend** - Medusa v2 API with multi-tenant support
2. **Storefront** - Next.js storefront with tenant routing
3. **Sales Page** - Marketing site with pricing and signup

## Railway Deployment

### 1. Backend Deployment

Deploy the Medusa backend to Railway:

```bash
# Connect to Railway
railway login

# Create new project
railway new medusa-saas-backend

# Deploy backend
cd backend
railway up
```

**Environment Variables for Backend:**
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
SAAS_DOMAIN=yourdomain.com
```

### 2. Storefront Deployment

Deploy the Next.js storefront:

```bash
# Create new Railway service for storefront
railway service create medusa-saas-storefront

# Deploy storefront
cd storefront
railway up
```

**Environment Variables for Storefront:**
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend.railway.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_DEFAULT_REGION=us
```

### 3. Sales Page Deployment

Deploy the marketing site:

```bash
# Create new Railway service for sales page
railway service create medusa-saas-salespage

# Deploy sales page
cd salespage
railway up
```

**Environment Variables for Sales Page:**
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
NEXT_PUBLIC_SAAS_DOMAIN=yourdomain.com
```

## DNS Configuration

### 1. Main Domain Setup

Point your main domain to the sales page:
- `yourdomain.com` → Sales page Railway URL
- `www.yourdomain.com` → Sales page Railway URL

### 2. Wildcard Subdomain Setup

Configure wildcard DNS for tenant subdomains:
- `*.yourdomain.com` → Storefront Railway URL

### 3. Custom Domains (Optional)

For tenants with custom domains:
- Configure CNAME records pointing to your storefront domain
- Update tenant metadata with custom domain

## Environment Variables Summary

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Redis
REDIS_URL=redis://user:pass@host:port

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...

# SaaS Configuration
SAAS_DOMAIN=yourdomain.com
```

### Storefront (.env.local)
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend.railway.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_DEFAULT_REGION=us
```

### Sales Page (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
NEXT_PUBLIC_SAAS_DOMAIN=yourdomain.com
```

## Post-Deployment Setup

### 1. Initialize Backend

```bash
# SSH into Railway backend service
railway shell

# Run database migrations and seed
npm run ib
```

### 2. Configure Stripe Webhooks

Add webhook endpoint in Stripe dashboard:
- URL: `https://your-backend.railway.app/webhooks/stripe`
- Events: `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.updated`, etc.

### 3. Test Tenant Creation

1. Visit your sales page
2. Sign up for a new tenant
3. Verify subdomain works: `tenant1.yourdomain.com`
4. Test admin access: `tenant1.yourdomain.com/admin`

## Monitoring & Maintenance

### 1. Database Monitoring

Monitor PostgreSQL usage and performance:
- Connection limits
- Query performance
- Storage usage

### 2. Redis Monitoring

Monitor Redis for:
- Memory usage
- Connection count
- Cache hit rates

### 3. Application Monitoring

Set up monitoring for:
- API response times
- Error rates
- Tenant usage limits
- Stripe webhook processing

## Scaling Considerations

### 1. Database Scaling

- Consider read replicas for high traffic
- Implement connection pooling
- Monitor query performance

### 2. Redis Scaling

- Use Redis Cluster for high availability
- Monitor memory usage
- Implement cache eviction policies

### 3. Application Scaling

- Use Railway's auto-scaling features
- Monitor CPU and memory usage
- Implement rate limiting per tenant

## Security Considerations

### 1. Data Isolation

- Ensure tenant data is properly isolated
- Regular security audits
- Monitor for cross-tenant data leaks

### 2. API Security

- Implement rate limiting
- Use proper authentication
- Monitor for abuse

### 3. Payment Security

- Secure Stripe webhook processing
- PCI compliance considerations
- Regular security updates

## Backup Strategy

### 1. Database Backups

- Automated daily backups
- Point-in-time recovery
- Cross-region backups

### 2. File Storage

- Regular backups of uploaded files
- Version control for important files
- Disaster recovery procedures

## Troubleshooting

### Common Issues

1. **Tenant not loading**: Check DNS configuration and middleware
2. **Payment failures**: Verify Stripe webhook configuration
3. **Database errors**: Check connection limits and performance
4. **Theme not applying**: Verify tenant theme cookies and CSS injection

### Debug Commands

```bash
# Check tenant resolution
curl -H "Host: tenant1.yourdomain.com" https://your-storefront.railway.app/api/healthcheck

# Test backend API
curl https://your-backend.railway.app/store/tenant?domain=tenant1.yourdomain.com

# Check database connectivity
railway shell
npm run db:status
```

## Support

For deployment issues:
1. Check Railway logs
2. Verify environment variables
3. Test API endpoints
4. Review DNS configuration
5. Check Stripe webhook logs

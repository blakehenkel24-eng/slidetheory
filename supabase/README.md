# Supabase Configuration for SlideTheory

## Environment Variables

Create a `.env` file in the project root with these variables:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Kimi API
KIMI_API_KEY=your-kimi-api-key

# Application
APP_URL=http://localhost:3000
NODE_ENV=development
```

## Setup Instructions

### 1. Create Supabase Project
1. Go to [https://app.supabase.io](https://app.supabase.io)
2. Create a new project
3. Copy the project URL and anon key

### 2. Apply Database Migrations

Option 1: Using Supabase Dashboard
1. Go to SQL Editor in Supabase Dashboard
2. Run migrations in order:
   - `001_create_users.sql`
   - `002_create_slides.sql`
   - `003_setup_rls.sql`

Option 2: Using Supabase CLI
```bash
supabase link --project-ref your-project-ref
supabase db push
```

### 3. Deploy Edge Functions

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Deploy functions
supabase functions deploy generate-slide
supabase functions deploy save-slide
supabase functions deploy get-slides
```

### 4. Set Edge Function Secrets

```bash
supabase secrets set KIMI_API_KEY=your-kimi-api-key
supabase secrets set SUPABASE_URL=your-supabase-url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Configure Auth Providers (Optional)

In Supabase Dashboard:
1. Go to Authentication > Providers
2. Enable Email provider (enabled by default)
3. Configure Magic Link settings if desired
4. Optionally enable Google, GitHub OAuth

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login with password or magic link

### Slides
- `POST /api/slides/generate` - Generate slide content
- `POST /api/slides` - Save slide to library
- `GET /api/slides` - List user's slides
- `GET /api/slides/:id` - Get single slide
- `DELETE /api/slides/:id` - Delete slide

## Database Schema

### users
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key, references auth.users |
| email | text | User email |
| full_name | text | Display name |
| avatar_url | text | Profile image URL |
| subscription_tier | enum | free/pro/team |
| created_at | timestamp | Creation time |
| updated_at | timestamp | Last update |

### slides
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Owner reference |
| title | text | Slide title |
| content | jsonb | Slide content/data |
| slide_type | text | Type of slide |
| audience | text | Target audience |
| context | text | Generation context |
| data | text | Input data |
| key_takeaway | text | Main message |
| presentation_mode | boolean | Presentation flag |
| image_url | text | Generated image URL |
| created_at | timestamp | Creation time |
| updated_at | timestamp | Last update |

## Security

### Row Level Security (RLS)
- Users can only access their own slides
- Users can only update their own profile
- All database access goes through RLS policies

### Authentication
- JWT tokens from Supabase Auth
- Required for all slide operations
- Optional for public features (future)

## Testing

### Test Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Generate Slide
```bash
curl -X POST http://localhost:3000/api/slides/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "slide_type": "Executive Summary",
    "audience": "C-Suite",
    "context": "Q4 performance review",
    "key_takeaway": "Strong growth positions us for Series B"
  }'
```

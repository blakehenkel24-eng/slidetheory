-- Migration: 003_setup_rls.sql
-- Set up Row Level Security policies for slides

-- Slides RLS Policies

-- Policy: Users can view their own slides
CREATE POLICY "Users can view own slides"
    ON public.slides FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own slides
CREATE POLICY "Users can insert own slides"
    ON public.slides FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own slides
CREATE POLICY "Users can update own slides"
    ON public.slides FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Users can delete their own slides
CREATE POLICY "Users can delete own slides"
    ON public.slides FOR DELETE
    USING (auth.uid() = user_id);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.slides TO authenticated;
GRANT SELECT, UPDATE ON public.users TO authenticated;
GRANT USAGE ON SEQUENCE public.slides_id_seq TO authenticated;

-- Grant anon users ability to sign up (insert into users handled by trigger)
GRANT SELECT ON public.users TO anon;

-- Create function to get user's slide count
CREATE OR REPLACE FUNCTION public.get_user_slide_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    slide_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO slide_count
    FROM public.slides
    WHERE user_id = p_user_id;
    RETURN slide_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's recent slides
CREATE OR REPLACE FUNCTION public.get_recent_slides(
    p_user_id UUID,
    p_limit INTEGER DEFAULT 10
)
RETURNS SETOF public.slides AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.slides
    WHERE user_id = p_user_id
    ORDER BY created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for slides with user info (for admin purposes)
CREATE OR REPLACE VIEW public.slides_with_users AS
SELECT 
    s.*,
    u.email as user_email,
    u.full_name as user_full_name
FROM public.slides s
JOIN public.users u ON s.user_id = u.id;

-- Only service role can access this view
REVOKE ALL ON public.slides_with_users FROM authenticated, anon;

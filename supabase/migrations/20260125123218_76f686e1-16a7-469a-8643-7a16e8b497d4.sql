CREATE OR REPLACE FUNCTION public.register_lead(user_email text, ref_code text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_referral_code text;
BEGIN
  -- Email Format Validation using regex
  IF user_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Email Length Check
  IF length(user_email) > 255 THEN
    RAISE EXCEPTION 'Email too long';
  END IF;

  -- Normalize email
  user_email := lower(trim(user_email));

  -- Validate referral code exists if provided
  IF ref_code IS NOT NULL AND ref_code != '' THEN
    IF NOT EXISTS(SELECT 1 FROM public.leads WHERE referral_code = ref_code) THEN
      -- Invalid referral code - silently ignore instead of error (better UX)
      ref_code := NULL;
    END IF;
  END IF;

  -- Generate unique referral code
  new_referral_code := public.generate_referral_code();
  
  -- Insert the new lead
  INSERT INTO public.leads (email, referral_code, referred_by)
  VALUES (user_email, new_referral_code, ref_code);
  
  -- If there's a valid referrer, increment their count
  IF ref_code IS NOT NULL AND ref_code != '' THEN
    UPDATE public.leads
    SET referral_count = referral_count + 1
    WHERE referral_code = ref_code;
  END IF;
  
  RETURN new_referral_code;
END;
$function$;
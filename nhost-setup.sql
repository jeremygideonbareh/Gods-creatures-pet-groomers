-- Create helper function for Hasura user ID
CREATE OR REPLACE FUNCTION public.current_user_id() RETURNS text
  LANGUAGE sql STABLE
  AS $$ SELECT nullif(current_setting('hasura.user', true), '')::json->>'x-hasura-user-id' $$;

-- Site content table (public read, authenticated write)
CREATE TABLE site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_content_select_public" ON site_content
  FOR SELECT USING (true);

CREATE POLICY "site_content_insert_auth" ON site_content
  FOR INSERT WITH CHECK (public.current_user_id() IS NOT NULL);

CREATE POLICY "site_content_update_auth" ON site_content
  FOR UPDATE USING (public.current_user_id() IS NOT NULL);

-- Seed data
INSERT INTO site_content (section, content) VALUES
  ('hero', '{"title":"Gods Creatures Pet Groomers","subtitle":"Luxury grooming by experienced professionals — only the finest for your pet.","cta":"Book Appointment","video":"herosectionvideo.mp4","poster":"hero-poster.jpg"}'),
  ('why_choose_us', '{"heading":"Why Choose Us","cards":[{"icon":"🩺","title":"Vet-Backed Wellness","description":"Years of veterinary partnership ensuring every pet receives the highest standard of preventive care."},{"icon":"🧴","title":"Luxury Spa Grooming","description":"Premium imported products and gentle techniques by trained professionals who treat every pet like royalty."},{"icon":"🕐","title":"Years of Expertise","description":"Decades of combined experience — our well-trained team brings mastery and passion to every appointment."},{"icon":"✨","title":"Luxury Imported Products","description":"Premium shampoos, conditioners & treatments sourced from around the world for that extra touch of indulgence."}]}'),
  ('services', '{"heading":"Our Signature Services","subtitle":"Expertly crafted using the finest imported products.","items":[{"id":"luxury-bath","label":"Luxury bath & blow-dry","icon":"Bath","image":"https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=900","description":"Soft pastel shampoos, deep conditioning, and fluffy finishes."},{"id":"stylish-haircut","label":"Stylish haircut","icon":"Scissors","image":"https://images.unsplash.com/photo-1534361960057-19889db9621e?w=900","description":"Precision styling by experienced groomers."},{"id":"dental-hygiene","label":"Dental hygiene","icon":"Smile","image":"https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=900","description":"Professional dental care backed by years of veterinary expertise."},{"id":"pawdicure","label":"Pawdicure & nail art","icon":"PawPrint","image":"https://images.unsplash.com/photo-1544568100-847a948585b9?w=900","description":"Gentle paw care with imported balms and creative pet-safe colours."}]}'),
  ('reviews', '{"heading":"Happy Clients","testimonials":[{"emoji":"🐕","author":"Brunos Mom","tag":"Regular since 2023","text":"The grooming transformed my anxious rescue into a fluffy star.","textLong":"The level of care and expertise is unmatched."},{"emoji":"🐩","author":"Cocos Dad","tag":"Grooming + Wellness","text":"The dental hygiene program saved us a fortune in vet bills.","textLong":"The experienced team transformed Cocos coat completely."}],"images":["review-image1.png","review-image2.png","review-image3.png","reviewimage5.jpeg"]}'),
  ('booking', '{"heading":"Book Now","location":"Malki, Shillong","hours":"Mon–Sat 8am–4pm | Sunday closed","phone":"Call us to book your slot!","cta":"Book a Session","subtitle":"Walk-ins possible? Just give us a ring!","ctaIcon":"🐾","locationIcon":"📍","hoursIcon":"🕐","phoneIcon":"📞","modalTitle":"Book a Session","modalSubtitle":"Secure your spot — we will take care of the rest!","bookingFeeLabel":"₹500 booking fee","bookingFeeDetail":"Paid at time of service. Covers grooming essentials & wellness check.","proceedCta":"Proceed to Schedule","questionsCta":"Questions? Call us directly!","formTitle":"Book a Session","formSubtitle":"Fill in the details and we will get back to you!","advancePaymentTitle":"Advance Payment (₹500)","advancePaymentDetail":"A ₹500 advance is required to secure your grooming slot.","upiTooltip":"Find the 12-digit UPI Ref Number (UTR) in your GPay/PhonePe history.","upiPlaceholder":"UPI Reference No. / Transaction ID *","submitLabel":"send request","submittingLabel":"Sending...","successEmoji":"🎉","successTitle":"Woohoo!","successMessage":"Your request has been sent. We will get back to you with a confirmed slot!"}'),
  ('page_backgrounds', '{"whyChooseUs":"https://images.unsplash.com/photo-1544568100-847a948585b9?w=900","reviews":"https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=900","booking":"https://images.unsplash.com/photo-1552053831-71594a27632d?w=900"}');

-- Pets RLS
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pets_insert_own" ON pets
  FOR INSERT WITH CHECK (user_id::text = public.current_user_id());

CREATE POLICY "pets_select_own" ON pets
  FOR SELECT USING (user_id::text = public.current_user_id());

CREATE POLICY "pets_update_own" ON pets
  FOR UPDATE USING (user_id::text = public.current_user_id());

-- Add new columns for pricing
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS addons JSONB DEFAULT '[]';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_price INTEGER;

-- Bookings RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookings_insert_own" ON bookings
  FOR INSERT WITH CHECK (user_id::text = public.current_user_id());

CREATE POLICY "bookings_select_own" ON bookings
  FOR SELECT USING (user_id::text = public.current_user_id());

-- Seed pricing_menu content
INSERT INTO site_content (section, content) VALUES
('pricing_menu', '{"rules":"Booking by appointment only. A ₹500 booking fee is required (adjusted in your final bill).","basicServices":[{"id":"bath-brush-nail-ear","label":"Bath + Brush + Nail Trim + Ear Cleaning","prices":{"small":1800,"medium":2100,"large":2400,"xlarge":2800}},{"id":"haircut-styling","label":"Haircut / Styling Only","prices":{"small":1200,"medium":1400,"large":1600,"xlarge":1800}},{"id":"nail-trim-ear-cleaning","label":"Nail Trim + Ear Cleaning Only","flat":500}],"completePackages":[{"id":"full-groom","label":"Full Groom (Bath + Haircut + Nails + Ears)","prices":{"small":2500,"medium":2900,"large":3300,"xlarge":3800}},{"id":"full-spa","label":"Full Spa Package (Everything included)","prices":{"small":2900,"medium":3400,"large":3900,"xlarge":4500}}],"addOnServices":[{"id":"teeth-cleaning","label":"Teeth Cleaning","flat":400},{"id":"flea-tick","label":"Flea & Tick Removal Treatment","flat":500},{"id":"deshedding","label":"De-shedding Treatment","prices":{"small":500,"medium":600,"large":700,"xlarge":800}},{"id":"spa-massage","label":"Spa with Massage & Conditioning","prices":{"small":700,"medium":800,"large":900,"xlarge":1000}}],"weightCategories":{"small":{"label":"Small (Up to 10kg)","maxKg":10},"medium":{"label":"Medium (10-20kg)","maxKg":20},"large":{"label":"Large (20-35kg)","maxKg":35},"xlarge":{"label":"Extra Large (Above 35kg)","maxKg":999}}}')
ON CONFLICT (section) DO NOTHING;

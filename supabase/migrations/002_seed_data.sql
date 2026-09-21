insert into public.categories (id, name, slug) values
  ('11111111-1111-1111-1111-111111111111', 'Vegetable', 'vegetable'),
  ('22222222-2222-2222-2222-222222222222', 'Fruit', 'fruit'),
  ('33333333-3333-3333-3333-333333333333', 'Herb', 'herb'),
  ('44444444-4444-4444-4444-444444444444', 'Flower', 'flower'),
  ('55555555-5555-5555-5555-555555555555', 'Tree', 'tree'),
  ('66666666-6666-6666-6666-666666666666', 'Other', 'other')
on conflict (id) do nothing;

insert into public.plants (
  id, name, scientific_name, slug, category_id, short_description, description,
  growing_season, growth_duration, sunlight, watering, soil_type, care_tips,
  status, is_featured, created_at, updated_at
) values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Heirloom Tomato',
    'Solanum lycopersicum',
    'heirloom-tomato',
    '11111111-1111-1111-1111-111111111111',
    'Juicy, richly flavored tomatoes for salads, roasting, and fresh slicing.',
    'This beloved tomato variety produces deep red fruit with a sweet-tart balance that shines in the kitchen. It thrives in warm conditions and rewards regular feeding with a long, generous harvest season.',
    'Late spring to early fall',
    '70-80 days',
    'Full sun',
    'Moderate, consistent moisture',
    'Loamy, well-drained soil',
    'Stake early and water at the base to reduce foliar disease. Mulch around the roots to keep soil evenly moist and support steady fruiting.',
    'published',
    true,
    now(),
    now()
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Sweet Basil',
    'Ocimum basilicum',
    'sweet-basil',
    '33333333-3333-3333-3333-333333333333',
    'A fragrant kitchen staple with bright, peppery leaves.',
    'Sweet basil brings unmistakable aroma to pastas, pesto, and fresh salads. The plant grows quickly under warm conditions and makes an excellent companion near tomatoes and peppers.',
    'Spring through fall',
    '40-60 days',
    'Full sun to partial shade',
    'Regular, even moisture',
    'Rich, well-draining soil',
    'Pinch the growing tips regularly to encourage bushier growth and prevent flowering too early. Harvest frequently to keep the plant productive.',
    'published',
    true,
    now(),
    now()
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Strawberry Bliss',
    'Fragaria × ananassa',
    'strawberry-bliss',
    '22222222-2222-2222-2222-222222222222',
    'Sweet, sun-ripened berries with a vibrant, floral finish.',
    'This productive strawberry cultivar produces fragrant fruit with a balanced sweetness and bright acidity. It is well suited to raised beds and containers with careful watering.',
    'Spring and early summer',
    '90-120 days',
    'Full sun',
    'Consistent moisture during fruiting',
    'Sandy loam with compost',
    'Mulch around the crowns to keep fruit clean and roots cool. Remove runners if you want stronger fruit production in a compact bed.',
    'published',
    false,
    now(),
    now()
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Sunflower Gold',
    'Helianthus annuus',
    'sunflower-gold',
    '44444444-4444-4444-4444-444444444444',
    'Tall, cheerful blooms that brighten beds and attract pollinators.',
    'Sunflower Gold brings bold color and a strong pollinator-friendly presence to the farm. With sturdy stems and large golden flowers, it helps support bees and adds long-lasting interest.',
    'Late spring to early fall',
    '60-75 days',
    'Full sun',
    'Moderate, avoid overwatering',
    'Well-drained, fertile soil',
    'Sow after the last frost and provide strong support for taller stems in windy spots. Deadhead spent blooms to extend flowering and encourage a second flush.',
    'published',
    true,
    now(),
    now()
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'Apple Tree',
    'Malus domestica',
    'apple-tree',
    '55555555-5555-5555-5555-555555555555',
    'A classic orchard tree yielding crisp, aromatic fruit year after year.',
    'Our apple tree selection is bred for flavor, vigor, and easy harvest. The compact form fits small orchard plots while still maintaining a generous yield in a healthy season.',
    'Spring through fall',
    '2-4 years to first fruit',
    'Full sun',
    'Deep watering during dry spells',
    'Well-drained loam with organic matter',
    'Prune lightly during dormancy to maintain airflow and structure. Thin fruit clusters when young to encourage larger, sweeter apples.',
    'draft',
    false,
    now(),
    now()
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'Baby Kale',
    'Brassica oleracea var. acephala',
    'baby-kale',
    '11111111-1111-1111-1111-111111111111',
    'Tender greens with sturdy leaves and a rich earthy flavor.',
    'Baby kale is a quick, versatile leafy green suited for salads, sautés, and smoothies. It grows well in cool months and has a sweet, robust flavor that holds up well to cooking.',
    'Cool season',
    '30-45 days',
    'Partial sun to full sun',
    'Moderate and regular',
    'Rich, moisture-retentive soil',
    'Succession sow every 2-3 weeks for continued harvest and keep the soil evenly moist to avoid bitterness. Harvest young leaves for tender texture.',
    'published',
    false,
    now(),
    now()
  );

insert into public.plant_images (id, plant_id, url, storage_path, alt_text, sort_order, is_cover)
values
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80', 'plants/heirloom-tomato-1.jpg', 'Fresh heirloom tomatoes on a vine', 1, true),
  ('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80', 'plants/heirloom-tomato-2.jpg', 'Tomato plants in a greenhouse', 2, false),
  ('33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=900&q=80', 'plants/sweet-basil-1.jpg', 'Fresh sweet basil leaves', 1, true),
  ('44444444-4444-4444-4444-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=80', 'plants/strawberry-bliss-1.jpg', 'Ripe strawberries on a plant', 1, true),
  ('55555555-5555-5555-5555-555555555555', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&w=900&q=80', 'plants/sunflower-gold-1.jpg', 'Sunflowers blooming in the field', 1, true),
  ('66666666-6666-6666-6666-666666666666', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=900&q=80', 'plants/apple-tree-1.jpg', 'Apple tree in bloom', 1, true),
  ('77777777-7777-7777-7777-777777777777', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80', 'plants/baby-kale-1.jpg', 'Fresh kale leaves', 1, true);

insert into public.site_settings (
  id, farm_name, tagline, about_text, hero_image, contact_email, contact_phone, contact_address,
  instagram_url, facebook_url
) values (
  '4d0a4a7f-f7d6-4127-b7a2-6beef0a9c55c',
  'Clover & Root Farm',
  'Seasonal abundance from soil to table.',
  'Clover & Root Farm grows healthy, vibrant plants with regenerative practices and careful stewardship. Our greenhouse and fields are designed around soil health, pollinator-friendly growing, and produce that tastes as good as it looks.',
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1600&q=80',
  'hello@cloverandrootfarm.com',
  '+1 (415) 555-0147',
  '214 Orchard Lane, Sonoma Valley, CA',
  'https://instagram.com',
  'https://facebook.com'
) on conflict (id) do nothing;

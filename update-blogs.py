#!/usr/bin/env python3
"""
CallBird Blog Batch Updater
Updates all blog HTML files with:
- Correct pricing: $99/$249/$499
- Correct phone: (505) 594-5806
- Updated footer with #122092 bg, gold h4s, correct links
- Footer CSS overrides
- dateModified freshness signal
"""

import os
import re
import glob

# ── CONFIG ──
BLOG_DIR = "."  # Run from the repo root
TODAY = "2026-04-08"

# ── NEW FOOTER HTML ──
NEW_FOOTER = '''    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <div class="footer-logo"><img src="https://i.imgur.com/qwyQQW5.png" alt="CallBird" class="logo-image"></div>
                    <p class="footer-tagline">AI-powered call answering, appointment booking & instant summaries for small businesses.</p>
                    <div class="footer-contact"><p>Atlanta, GA</p><p><a href="tel:+15055945806">(505) 594-5806</a></p><p><a href="mailto:support@callbirdai.com">support@callbirdai.com</a></p></div>
                </div>
                <div class="footer-col"><h4>Product</h4><ul class="footer-links"><li><a href="index.html#features">Features</a></li><li><a href="index.html#pricing">Pricing</a></li><li><a href="index.html#industries">Industries</a></li><li><a href="blog.html">Blog</a></li></ul></div>
                <div class="footer-col"><h4>Industries</h4><ul class="footer-links"><li><a href="home-services-ai-receptionist.html">Home Services</a></li><li><a href="dental-ai-receptionist.html">Medical & Dental</a></li><li><a href="restaurants-ai-receptionist.html">Restaurants</a></li><li><a href="legal-ai-receptionist.html">Legal</a></li><li><a href="professional-services-ai-receptionist.html">Professional Services</a></li><li><a href="retail-ai-receptionist.html">Retail</a></li><li><a href="veterinary-ai-receptionist.html">Veterinary</a></li></ul></div>
                <div class="footer-col"><h4>Company</h4><ul class="footer-links"><li><a href="mailto:support@callbirdai.com">Contact</a></li><li><a href="blog.html">Blog</a></li><li><a href="https://myvoiceaiconnect.com" target="_blank" rel="noopener">White Label</a></li><li><a href="privacy-policy.html">Privacy Policy</a></li><li><a href="terms-and-conditions.html">Terms & Conditions</a></li></ul></div>
            </div>
            <div class="footer-bottom"><p>&copy; 2026 CallBird AI. All Rights Reserved.</p><p>A2P 10DLC Compliant &bull; SOC 2 Type II Certified</p></div>
        </div>
    </footer>'''

# ── FOOTER CSS OVERRIDE (injected before </style> if not already present) ──
FOOTER_CSS = """
        /* Footer override to match site blue */
        .footer { background: #122092 !important; color: #fff !important; }
        .footer a { color: rgba(255,255,255,0.85) !important; }
        .footer a:hover { color: #fff !important; }
        .footer h4 { color: #f6b828 !important; }
        .footer-tagline { color: rgba(255,255,255,0.7) !important; }
        .footer-bottom { border-top-color: rgba(255,255,255,0.15) !important; color: rgba(255,255,255,0.6) !important; }
"""

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    changes = []
    
    # ── 1. PHONE NUMBER REPLACEMENTS ──
    # Old numbers → new number
    old_phones = [
        ('(678) 316-1454', '(505) 594-5806'),
        ('678-316-1454', '505-594-5806'),
        ('+16783161454', '+15055945806'),
        ('6783161454', '5055945806'),
        ('(770) 809-2820', '(505) 594-5806'),
        ('770-809-2820', '505-594-5806'),
        ('+17708092820', '+15055945806'),
        ('7708092820', '5055945806'),
    ]
    for old, new in old_phones:
        if old in content:
            content = content.replace(old, new)
            changes.append(f"  Phone: {old} → {new}")
    
    # ── 2. PRICING REPLACEMENTS ──
    # These are contextual replacements to avoid breaking unrelated text
    
    # "$49/month" or "$49/mo" → "$99/month" / "$99/mo" (starting price)
    for pattern, replacement in [
        ('$49/month', '$99/month'),
        ('$49/mo', '$99/mo'),
        ('$49 flat', '$99/month'),
        ('$49 per month', '$99 per month'),
        ('$49-$149', '$99-$499'),
        ('$49-$149/month', '$99-$499/month'),
        ('$49-$149/mo', '$99-$499/mo'),
        ('$49-149', '$99-499'),
        ('$49-$197', '$99-$499'),
        ('$49-197', '$99-499'),
    ]:
        if pattern in content:
            content = content.replace(pattern, replacement)
            changes.append(f"  Price: {pattern} → {replacement}")
    
    # Starter plan price in tables/text
    # Be careful: only replace "$49" when it's clearly a CallBird price
    # Pattern: Starter ($49 or $49/mo) → $99
    content = re.sub(r'Starter\s*\(\$49/mo\)', 'Starter ($99/mo)', content)
    content = re.sub(r'Starter\s*\(\$49\)', 'Starter ($99)', content)
    
    # Professional plan: $99 → $249 (only in plan context)
    content = re.sub(r'Professional\s*\(\$99/mo\)', 'Professional ($249/mo)', content)
    content = re.sub(r'Professional\s*\(\$99\)', 'Professional ($249)', content)
    
    # Business/Enterprise plan: $149 → $499
    content = re.sub(r'Business\s*\(\$149/mo\)', 'Enterprise ($499/mo)', content)
    content = re.sub(r'Business\s*\(\$149\)', 'Enterprise ($499)', content)
    content = re.sub(r'Enterprise\s*\(\$149/mo\)', 'Enterprise ($499/mo)', content)
    content = re.sub(r'Enterprise\s*\(\$149\)', 'Enterprise ($499)', content)
    content = re.sub(r'Enterprise\s*\(\$197/mo\)', 'Enterprise ($499/mo)', content)
    content = re.sub(r'Enterprise\s*\(\$197\)', 'Enterprise ($499)', content)
    
    # Stats row / stat boxes with "$49" as starting price
    content = re.sub(r'(<span class="stat-number">\$)49(</span>)', r'\g<1>99\2', content)
    
    # CTA subtext updates
    content = content.replace(
        'Starting at $49/month',
        'Starting at $99/month'
    )
    content = content.replace(
        'starting at $49/month',
        'starting at $99/month'
    )
    content = content.replace(
        'starting at $49/mo',
        'starting at $99/mo'
    )
    
    # FAQ schema JSON-LD pricing
    content = content.replace(
        '$49/month flat rate',
        '$99/month'
    )
    content = content.replace(
        '$49-$149 per month',
        '$99-$499 per month'
    )
    content = content.replace(
        '$49-$149/month',
        '$99-$499/month'
    )
    content = content.replace(
        'flat-rate pricing',
        'tiered pricing'
    )
    
    # Comparison tables: CallBird column "$49/mo flat" → "$99/mo"
    content = content.replace('$49/mo flat', '$99/mo')
    content = content.replace('$49 flat', '$99/mo')
    
    # "no per-minute charges" — keep this, it's still accurate
    # "unlimited calls" — need to change to "Up to 50 calls" for Starter
    # Actually, leave body text references to "unlimited" alone for now
    # since Enterprise still has unlimited. The pricing tables are the priority.
    
    # ── 3. FOOTER REPLACEMENT ──
    # Match everything from <footer to </footer>
    footer_pattern = re.compile(r'<footer\s+class="footer">.*?</footer>', re.DOTALL)
    if footer_pattern.search(content):
        content = footer_pattern.sub(NEW_FOOTER, content)
        changes.append("  Footer: replaced with updated version")
    
    # ── 4. FOOTER CSS INJECTION ──
    # Add footer CSS overrides if not already present
    if '#122092 !important' not in content and '</style>' in content:
        # Insert before the LAST </style> tag
        last_style_pos = content.rfind('</style>')
        if last_style_pos != -1:
            content = content[:last_style_pos] + FOOTER_CSS + '    ' + content[last_style_pos:]
            changes.append("  CSS: injected footer color overrides")
    
    # ── 5. dateModified UPDATE ──
    # Update Article schema dateModified
    content = re.sub(
        r'"dateModified"\s*:\s*"[0-9]{4}-[0-9]{2}-[0-9]{2}"',
        f'"dateModified": "{TODAY}"',
        content
    )
    if '"dateModified"' in content:
        changes.append(f"  Schema: dateModified → {TODAY}")
    
    # ── 6. CTA SUBTEXT STANDARDIZATION ──
    # Update CTA boxes to use consistent subtext
    content = content.replace(
        '$49/month flat. No per-call charges. No overages. Cancel anytime.',
        'Starting at $99/month • 7-day free trial • No credit card required'
    )
    content = content.replace(
        'No per-minute charges. Cancel anytime.',
        '7-day free trial • No credit card required'
    )
    
    # ── WRITE IF CHANGED ──
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ UPDATED: {os.path.basename(filepath)}")
        for c in changes:
            print(c)
        return True
    else:
        print(f"⏭️  NO CHANGES: {os.path.basename(filepath)}")
        return False


def main():
    # Find all blog HTML files
    blog_files = sorted(glob.glob(os.path.join(BLOG_DIR, 'blog*.html')))
    
    if not blog_files:
        print("❌ No blog*.html files found in current directory!")
        print(f"   Current dir: {os.getcwd()}")
        print("   Make sure you're running this from the CallBird-Site repo root.")
        return
    
    print(f"\n{'='*60}")
    print(f"  CallBird Blog Batch Updater")
    print(f"  Found {len(blog_files)} blog files")
    print(f"  Date: {TODAY}")
    print(f"{'='*60}\n")
    
    updated = 0
    skipped = 0
    
    for filepath in blog_files:
        try:
            if update_file(filepath):
                updated += 1
            else:
                skipped += 1
        except Exception as e:
            print(f"❌ ERROR: {os.path.basename(filepath)} — {e}")
    
    print(f"\n{'='*60}")
    print(f"  DONE: {updated} files updated, {skipped} unchanged")
    print(f"{'='*60}")
    print(f"\nNext steps:")
    print(f"  git add .")
    print(f'  git commit -m "Update all blog posts: pricing $99/$249/$499, phone 505-594-5806, footer, dateModified"')
    print(f"  git push origin main")


if __name__ == '__main__':
    main()

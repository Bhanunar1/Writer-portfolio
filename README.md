# Kal Krish — Author Portfolio Website

A dark, cinematic portfolio website for author Kal Krish (Narala Bhanu Prakash).

## Features

- **Dark Cinematic Theme** - Elegant dark design with gold accents
- **Fully Responsive** - Works beautifully on desktop, tablet, and mobile
- **Smooth Animations** - Scroll-triggered animations and transitions
- **Single Page Application** - All sections on one page with smooth scrolling navigation
- **Modern UI/UX** - Clean, professional design with excellent user experience

## Pages/Sections

1. **Home** - Hero section with tagline, author photo placeholder, scrolling book names, and CTAs
2. **About** - Short and long biography sections
3. **Books** - Featured works showcase (Shadow, Room No.217, Nature-Man, Betting Baddhithudu)
4. **Writing Style** - Signature style elements and genres
5. **Themes** - Frequently explored themes
6. **Journey** - Writing philosophy and journey
7. **Contact** - Contact information and social links

## Customization

### 1. Replace Placeholder Content

- **Author Photo**: Replace the placeholder div in `index.html` (line ~47) with an actual image:
  ```html
  <img src="path/to/your-photo.jpg" alt="Kal Krish" class="author-photo">
  ```
  Then add CSS:
  ```css
  .author-photo {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--accent-gold);
  }
  ```

### 2. Update Contact Information

In `index.html`, update the contact section (around line 280):
- Replace `your-email-here` with your actual email
- Replace `your-handle` with your actual Instagram and Twitter handles
- Update the website URL when available

### 3. Add Your Logo

You can replace the logo in the navbar with an actual logo image:
```html
<img src="path/to/logo.png" alt="Kal Krish" class="logo-image">
```

### 4. Customize Colors

In `styles.css`, modify the CSS variables at the top:
```css
:root {
    --accent-gold: #d4af37;  /* Change to your preferred accent color */
    /* ... other variables */
}
```

### 5. Add Book Covers

Add book cover images to the book cards:
```html
<div class="book-cover">
    <img src="path/to/shadow-cover.jpg" alt="Shadow">
</div>
```

## File Structure

```
WPort/
├── index.html      # Main HTML file
├── styles.css      # All styling
├── script.js       # JavaScript for interactivity
└── README.md       # This file
```

## How to Use

1. **Local Development**: Simply open `index.html` in a web browser
2. **Web Hosting**: Upload all files to your web hosting service
3. **GitHub Pages**: Push to a GitHub repository and enable GitHub Pages

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized CSS with minimal dependencies
- Vanilla JavaScript (no frameworks)
- Google Fonts loaded via CDN
- Smooth 60fps animations

## Future Enhancements

- Add a contact form
- Integrate with a CMS for easy content updates
- Add a blog section
- Include book purchase links
- Add testimonials/reviews section
- Newsletter signup integration

## Credits

- Fonts: Playfair Display & Inter (Google Fonts)
- Design: Custom dark cinematic theme
- Icons: Emoji-based icons (can be replaced with icon fonts)

---

**Kal Krish** — Writer of Worlds, Weaver of Shadows

"Stories born from struggle, grown with imagination, and lived through emotion."

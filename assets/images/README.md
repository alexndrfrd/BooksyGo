# BooksyGo Assets

## Logos

Place the BooksyGo logo files here:

- `logo.png` - Main logo (square, 1000x1000px recommended)
- `logo-horizontal.png` - Horizontal version for headers
- `logo-icon.png` - Icon only (for favicons, app icons)
- `logo-white.png` - White version for dark backgrounds

## Usage

```jsx
// In Next.js components
import Image from 'next/image'
import logo from '@/assets/images/logo.png'

<Image src={logo} alt="BooksyGo" width={200} height={200} />
```

## Brand Colors

Based on the logo:
- **Primary Purple**: `#4A148C` or similar
- **Accent Yellow/Gold**: `#FFC107` or `#FFD700`
- **White**: `#FFFFFF`

## Guidelines

- Maintain aspect ratio
- Don't stretch or distort
- Keep clear space around logo
- Use white version on dark backgrounds
- Use colored version on light backgrounds


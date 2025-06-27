# Moncler Landing Page - Next.js

A modern, responsive landing page for Moncler fashion brand built with Next.js, featuring stunning animations and a premium user experience.

## 🚀 Features

- **Modern Design**: Premium fashion brand aesthetic with gradient backgrounds and custom typography
- **Responsive Layout**: Optimized for all device sizes
- **Smooth Animations**: GSAP-powered animations for engaging user interactions
- **Vertical Swiper**: Immersive vertical carousel with coverflow effects
- **Image Optimization**: Next.js Image component for optimal loading performance
- **TypeScript**: Full type safety and better developer experience
- **Custom Fonts**: P22 custom font integration with web font fallbacks

## 🛠️ Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Swiper.js** - Modern carousel/slider library
- **GSAP** - Professional animation library
- **CSS3** - Custom styling with modern features
- **Remix Icons** - Beautiful icon library

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd moncler-landing
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
moncler-landing/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main landing page
├── public/
│   ├── images/              # Product images
│   │   ├── 1.png
│   │   ├── 2.png
│   │   └── 3.png
│   └── fonts/               # Custom fonts
│       └── font.ttf
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## 🎨 Design Features

### Navigation

- Clean, minimal navigation bar
- Search functionality
- Shopping cart integration
- Account access

### Product Showcase

- Vertical carousel with 3 product variants
- Smooth coverflow transitions
- Thumbnail navigation
- Animated product information

### Interactive Elements

- Hover effects on all interactive elements
- Smooth scroll indicators
- Social media links
- Call-to-action buttons

## 🔧 Customization

### Adding New Products

Edit the `products` array in `app/page.tsx`:

```typescript
const products = [
  {
    id: 1,
    title: "PRODUCT NAME",
    color: "Color Name",
    price: "$PRICE",
    background: "linear-gradient(to bottom, #COLOR1, #COLOR2)",
    image: "/images/product.png",
    thumbBackground: "#COLOR",
  },
  // Add more products...
];
```

### Styling

- Global styles: `app/globals.css`
- Component-specific styles: Use CSS modules or styled-components
- Responsive breakpoints: Defined in global CSS

## 📱 Responsive Design

The landing page is fully responsive with optimized layouts for:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

```bash
npm run build
npm run start
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using Next.js and modern web technologies**

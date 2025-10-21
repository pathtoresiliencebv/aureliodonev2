// import Link from "next/link";

interface StoreFooterProps {
  storeSlug: string;
}

export function StoreFooter({ storeSlug }: StoreFooterProps) {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-xl">Aurelio Store</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for quality products and exceptional service.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`/s/${storeSlug}/products`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  All Products
                </a>
              </li>
              <li>
                <a
                  href={`/s/${storeSlug}/collections`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Collections
                </a>
              </li>
              <li>
                <a
                  href={`/s/${storeSlug}/about`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href={`/s/${storeSlug}/contact`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`/s/${storeSlug}/shipping`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href={`/s/${storeSlug}/returns`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a
                  href={`/s/${storeSlug}/faq`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href={`/s/${storeSlug}/support`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`/s/${storeSlug}/privacy`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href={`/s/${storeSlug}/terms`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href={`/s/${storeSlug}/cookies`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Aurelio Store. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground">Powered by</span>
            <a
              href="https://aurelio.com"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Aurelio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

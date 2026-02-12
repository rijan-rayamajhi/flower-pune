import StaticLayout from "@/components/static-layout";

export default function TermsPage() {
    return (
        <StaticLayout
            title="Terms of Service"
            subtitle="Terms and conditions for using our services."
            maxWidth="2xl"
        >
            <div className="space-y-8">
                <section>
                    <p className="text-charcoal/70 text-sm italic mb-4">Last Updated: February 2026</p>
                    <p className="text-charcoal/80 font-light leading-loose">
                        By accessing and using the Luxe Floral Design website and services, you agree to be bound by these Terms of Service.
                    </p>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Orders and Payment</h2>
                    <p className="text-charcoal/80 font-light leading-loose">
                        All orders are subject to availability and confirmation. We reserve the right to refuse or cancel
                        any order for any reason. Payment must be received in full before delivery. We accept major credit cards,
                        debit cards, UPI, and net banking.
                    </p>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Product Variations</h2>
                    <p className="text-charcoal/80 font-light leading-loose">
                        Due to the seasonal nature of flowers, specific blooms and colors may vary slightly from images shown.
                        We guarantee that the overall design, quality, and value will be maintained. If substitution is necessary,
                        we will use flowers of equal or greater value.
                    </p>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Delivery</h2>
                    <p className="text-charcoal/80 font-light leading-loose">
                        Delivery times are estimates and not guaranteed. While we make every effort to deliver on the requested date,
                        delays may occur due to unforeseen circumstances. We are not responsible for deliveries to incorrect addresses
                        provided by the customer.
                    </p>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Returns and Refunds</h2>
                    <p className="text-charcoal/80 font-light leading-loose">
                        Due to the perishable nature of flowers, we do not accept returns. If you are dissatisfied with your order,
                        please contact us within 24 hours of delivery with photographic evidence. We will assess each complaint on a
                        case-by-case basis and may offer a replacement or refund at our discretion.
                    </p>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Cancellation Policy</h2>
                    <p className="text-charcoal/80 font-light leading-loose">
                        Orders can be cancelled or modified up to 12 hours before the scheduled delivery time.
                        Cancellations made after this time may incur a 50% cancellation fee. Same-day orders cannot be cancelled.
                    </p>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Intellectual Property</h2>
                    <p className="text-charcoal/80 font-light leading-loose">
                        All content on this website, including images, text, and designs, is the property of Luxe Floral Design
                        and protected by copyright laws. Unauthorized use is prohibited.
                    </p>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Limitation of Liability</h2>
                    <p className="text-charcoal/80 font-light leading-loose">
                        Luxe Floral Design shall not be liable for any indirect, incidental, or consequential damages arising
                        from the use of our services or products.
                    </p>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Contact</h2>
                    <p className="text-charcoal/80 font-light leading-loose">
                        For questions regarding these Terms of Service, please contact us at
                        <a href="mailto:hello@luxefloral.com" className="text-burgundy hover:underline ml-1">hello@luxefloral.com</a>.
                    </p>
                </section>
            </div>
        </StaticLayout>
    );
}

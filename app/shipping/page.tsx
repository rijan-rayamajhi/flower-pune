import StaticLayout from "@/components/static-layout";

export default function ShippingPage() {
    return (
        <StaticLayout
            title="Shipping & Delivery"
            subtitle="Fresh flowers, thoughtfully delivered."
            maxWidth="2xl"
        >
            <div className="space-y-8">
                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Delivery Areas</h2>
                    <p className="text-charcoal/80 font-light leading-loose">
                        We deliver throughout Pune city and select nearby areas. Please enter your pin code at checkout
                        to confirm delivery availability to your location.
                    </p>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Delivery Times</h2>
                    <ul className="list-none space-y-3 text-charcoal/80 font-light">
                        <li><strong className="font-medium">Same-Day Delivery:</strong> Available for orders placed before 12:00 PM IST. Orders placed after this time will be delivered the following day.</li>
                        <li><strong className="font-medium">Scheduled Delivery:</strong> Select your preferred delivery date at checkout. We recommend ordering at least 24 hours in advance for premium arrangements.</li>
                        <li><strong className="font-medium">Express Delivery:</strong> Available within 3 hours for select arrangements. Additional charges apply.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Delivery Charges</h2>
                    <p className="text-charcoal/80 font-light leading-loose">
                        Standard delivery is ₹150 within Pune city limits. Free delivery on orders above ₹3,000.
                        Express delivery charges vary based on distance and time.
                    </p>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Care Instructions</h2>
                    <p className="text-charcoal/80 font-light leading-loose">
                        All arrangements are delivered with care instructions and flower food. Handle your blooms gently,
                        keep them in a cool spot away from direct sunlight, and change the water every 2-3 days to extend their life.
                    </p>
                </section>

                <section>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">Special Requests</h2>
                    <p className="text-charcoal/80 font-light leading-loose">
                        For specific delivery instructions, gift messages, or timing requests, please add them in the
                        'Special Instructions' field at checkout or contact us directly.
                    </p>
                </section>
            </div>
        </StaticLayout>
    );
}

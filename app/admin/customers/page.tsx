import { Search, Mail, Phone, MapPin } from "lucide-react";
import PageHeader from "@/components/admin/page-header";

const CUSTOMERS = [
    { id: "1", name: "Liam Johnson", email: "liam@example.com", phone: "+1 (555) 001-2345", location: "New York, NY", orders: 12, spent: "$2,450" },
    { id: "2", name: "Olivia Smith", email: "olivia@example.com", phone: "+1 (555) 002-3456", location: "Los Angeles, CA", orders: 8, spent: "$1,890" },
    { id: "3", name: "Noah Williams", email: "noah@example.com", phone: "+1 (555) 003-4567", location: "Chicago, IL", orders: 24, spent: "$5,200" },
    { id: "4", name: "Emma Brown", email: "emma@example.com", phone: "+1 (555) 004-5678", location: "Houston, TX", orders: 5, spent: "$890" },
    { id: "5", name: "Ava Jones", email: "ava@example.com", phone: "+1 (555) 005-6789", location: "Phoenix, AZ", orders: 15, spent: "$3,100" },
];

export default function CustomersPage() {
    return (
        <div>
            <PageHeader
                title="Customers"
                description="View and manage customer details."
                action={
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-burgundy"
                        />
                    </div>
                }
            />

            <div className="grid gap-4">
                {CUSTOMERS.map((customer) => (
                    <div key={customer.id} className="rounded-xl bg-white p-6 border border-gray-100/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-burgundy/5 flex items-center justify-center text-burgundy font-serif font-bold text-lg">
                                {customer.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-medium text-charcoal">{customer.name}</h3>
                                <div className="flex items-center gap-4 mt-1 text-sm text-charcoal/60">
                                    <div className="flex items-center gap-1.5 hover:text-burgundy transition-colors cursor-pointer">
                                        <Mail className="h-3 w-3" />
                                        {customer.email}
                                    </div>
                                    <div className="hidden sm:flex items-center gap-1.5">
                                        <Phone className="h-3 w-3" />
                                        {customer.phone}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-8 border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                            <div className="text-center sm:text-right">
                                <p className="text-xs text-charcoal/50 uppercase tracking-wider">Orders</p>
                                <p className="font-bold text-charcoal">{customer.orders}</p>
                            </div>
                            <div className="text-center sm:text-right">
                                <p className="text-xs text-charcoal/50 uppercase tracking-wider">Total Spent</p>
                                <p className="font-bold text-charcoal">{customer.spent}</p>
                            </div>
                            <div className="hidden lg:block text-right">
                                <p className="text-xs text-charcoal/50 uppercase tracking-wider text-right">Location</p>
                                <div className="flex items-center justify-end gap-1 text-sm text-charcoal">
                                    <MapPin className="h-3 w-3" />
                                    {customer.location}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

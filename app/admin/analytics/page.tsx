import { TrendingUp, Users, ShoppingCart, DollarSign, ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/admin/page-header";

export default function AnalyticsPage() {
    return (
        <div>
            <PageHeader
                title="Analytics"
                description="Detailed insights into store performance."
                action={
                    <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-burgundy cursor-pointer">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>This Year</option>
                    </select>
                }
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Main Chart Placeholder */}
                <div className="col-span-full rounded-2xl bg-white p-6 border border-gray-100/50 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-serif text-lg font-medium text-charcoal">Revenue Growth</h3>
                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm font-medium">
                            <TrendingUp className="h-4 w-4" />
                            +24.5%
                        </div>
                    </div>
                    <div className="h-64 flex items-end gap-2 sm:gap-4 px-2">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                            <div key={i} className="flex-1 bg-burgundy/10 rounded-t-lg hover:bg-burgundy/20 transition-colors relative group">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-burgundy rounded-t-lg transition-all duration-500"
                                    style={{ height: `${h}%` }}
                                />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-charcoal text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    ${h * 100}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-charcoal/40 font-medium uppercase tracking-wider">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Aug</span>
                        <span>Sep</span>
                        <span>Oct</span>
                        <span>Nov</span>
                        <span>Dec</span>
                    </div>
                </div>

                {[
                    { title: "Total Sales", value: "$124,500", icon: DollarSign, color: "bg-emerald-50 text-emerald-600" },
                    { title: "Key Customers", value: "1,240", icon: Users, color: "bg-blue-50 text-blue-600" },
                    { title: "Avg. Order", value: "$182.50", icon: ShoppingCart, color: "bg-amber-50 text-amber-600" },
                ].map((stat, i) => (
                    <div key={i} className="rounded-2xl bg-white p-6 border border-gray-100/50 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-charcoal/60">{stat.title}</p>
                            <p className="text-2xl font-bold text-charcoal mt-1">{stat.value}</p>
                        </div>
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                    </div>
                ))}

                <div className="col-span-full md:col-span-2 rounded-2xl bg-white p-6 border border-gray-100/50 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-serif text-lg font-medium text-charcoal">Top Products</h3>
                        <button className="text-xs font-medium text-burgundy hover:text-burgundy/80 transition-colors flex items-center gap-1">
                            View All <ArrowUpRight className="h-3 w-3" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: "The Royal Blush", sales: 450, rev: "$83,250", width: "90%" },
                            { name: "Velvet Touch", sales: 320, rev: "$46,400", width: "75%" },
                            { name: "Golden Hour", sales: 210, rev: "$44,100", width: "60%" },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-charcoal">{item.name}</span>
                                    <span className="text-charcoal/60">{item.sales} sold</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-burgundy rounded-full" style={{ width: item.width }} />
                                </div>
                                <div className="text-right mt-1 text-xs font-bold text-charcoal">{item.rev}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

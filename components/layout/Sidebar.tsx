import { 
  LayoutGrid, 
  Box, 
  FileText, 
  File, 
  PieChart, 
  Target, 
  FileSearch,
  FileBarChart,
  Settings,
  ChevronDown,
  LogOut,
  Files,
  Building2,
  Table,
  UserPlus,
  Banknote,
  Calculator
} from "lucide-react";
import { cn } from "@lib/utils";
import { Link, useLocation } from "wouter";

const menuItems = [
  {
    category: "MAIN MENU",
    items: [
      { icon: LayoutGrid, label: "Dashboard", href: "/" },
      { icon: Box, label: "Apps", href: "/apps", hasSubmenu: true },
    ]
  },
  {
    category: "SHIPMENTS",
    items: [
      { icon: FileText, label: "Contracts", href: "/contracts" },
      { icon: File, label: "Invoices", href: "/invoices" },
      { icon: PieChart, label: "Expenses", href: "/expenses" },
      { icon: Target, label: "Accounting", href: "/accounting" },
    ]
  },
  {
    category: "REVIEW",
    items: [
      { icon: FileSearch, label: "Contracts Review & Statement", href: "/contractsreview" },
      { icon: FileBarChart, label: "Invoices Review & Statement", href: "/invoicesreview" },
    ]
  },
  {
    category: "STATEMENTS",
    items: [
      { icon: FileText, label: "Account Statement", href: "/accstatement" },
      { icon: Box, label: "Stocks", href: "/stocks" },
    ]
  },
  {
    category: "MISCELLANEOUS",
    items: [
      { icon: Files, label: "Misc Invoices", href: "/misc-invoices" },
      { icon: Building2, label: "Company Expenses", href: "/company-expenses" },
      { icon: Table, label: "Material Tables", href: "/material-tables" },
    ]
  },
  {
    category: "SUMMARY",
    items: [
      { icon: UserPlus, label: "Share Admin", href: "/share-admin" },
      { icon: Banknote, label: "CashFlow", href: "/cashflow" },
      { icon: Calculator, label: "Formula Tables", href: "/formula-tables" },
    ]
  }
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-primary text-white flex flex-col h-screen fixed left-0 top-0 z-50 overflow-y-auto custom-scrollbar">
      <div className="p-8 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tighter italic">IMS</h1>
        <p className="text-[10px] font-medium text-blue-200 tracking-[0.2em] mt-1">METALS & ALLOYS</p>
      </div>

      <div className="flex-1 py-4">
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-8 px-4">
            <h3 className="text-[10px] font-bold text-blue-200 mb-4 px-4 uppercase tracking-wider opacity-80">{section.category}</h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = location === item.href || (item.label === "Dashboard" && location === "/");
                return (
                  <Link key={item.label} href={item.href}>
                    <div className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group relative",
                      isActive 
                        ? "bg-white text-primary shadow-[0_4px_12px_rgba(0,0,0,0.1)] translate-x-1" 
                        : "text-blue-100 hover:bg-white/10 hover:text-white"
                    )}>
                      <item.icon className={cn(
                        "h-4 w-4 transition-colors",
                        isActive ? "text-primary" : "text-blue-200 group-hover:text-white"
                      )} />
                      <span>{item.label}</span>
                      {item.hasSubmenu && (
                        <ChevronDown className={cn(
                          "ml-auto h-3 w-3 opacity-70",
                          isActive ? "text-primary" : "text-blue-200"
                        )} />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div className="px-4 mt-8 mb-8 border-t border-blue-400/30 pt-8">
           <div className="space-y-1">
              <Link href="/settings">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white cursor-pointer transition-colors">
                  <Settings className="h-4 w-4 text-blue-200" />
                  <span>Setting</span>
                </div>
              </Link>
              <Link href="/logout">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white cursor-pointer transition-colors">
                  <LogOut className="h-4 w-4 text-blue-200" />
                  <span>Logout</span>
                </div>
              </Link>
           </div>
        </div>
      </div>
    </aside>
  );
}

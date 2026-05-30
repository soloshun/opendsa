"use client";

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Search, ArrowUpDown, GitBranch, TreeDeciduous, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    title: "Searching",
    description: "Linear, Binary, Jump search algorithms",
    icon: Search,
    href: "/visualize/searching/linear-search",
    count: 2,
    color: "from-emerald-500/20 to-emerald-500/5",
    available: true,
  },
  {
    title: "Sorting",
    description: "Bubble, Quick, Merge, Heap sort algorithms",
    icon: ArrowUpDown,
    href: "/visualize/sorting/bubble-sort",
    count: 6,
    color: "from-blue-500/20 to-blue-500/5",
    available: false,
  },
  {
    title: "Graph",
    description: "BFS, DFS, Dijkstra, A* algorithms",
    icon: GitBranch,
    href: "/visualize/graph/bfs",
    count: 4,
    color: "from-purple-500/20 to-purple-500/5",
    available: false,
  },
  {
    title: "Trees",
    description: "BST, AVL, traversals and operations",
    icon: TreeDeciduous,
    href: "/visualize/tree/bst",
    count: 3,
    color: "from-amber-500/20 to-amber-500/5",
    available: false,
  },
]

const recentAlgorithms = [
  { name: "Linear Search", category: "Searching", href: "/visualize/searching/linear-search", available: true },
  { name: "Binary Search", category: "Searching", href: "/visualize/searching/binary-search", available: true },
]

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Welcome Section */}
          <div className="relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-primary/10 via-background to-background p-6">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 size-32 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Sparkles className="size-4 text-primary" />
                <span>Welcome to</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                Open<span className="text-primary">DSA</span>
              </h1>
              <p className="mt-2 text-muted-foreground max-w-lg">
                Interactive visualizations to help you understand data structures and algorithms.
                Watch algorithms come to life, step by step.
              </p>
            </div>
          </div>

          {/* Category Cards */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <div
                  key={category.title}
                  className={`group relative overflow-hidden rounded-xl border border-border/50 bg-card p-5 transition-all duration-300 ${
                    category.available 
                      ? "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 cursor-pointer" 
                      : "opacity-60"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 transition-opacity group-hover:opacity-100`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`flex size-10 items-center justify-center rounded-lg ${category.available ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        <category.icon className="size-5" />
                      </div>
                      {category.available ? (
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {category.count} available
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          Coming soon
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{category.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                    {category.available && (
                      <Link
                        href={category.href}
                        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Explore <ArrowRight className="size-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Start Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Available Algorithms */}
            <div className="rounded-xl border border-border/50 bg-card p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                Available Now
              </h3>
              <div className="space-y-2">
                {recentAlgorithms.map((algo) => (
                  <Link
                    key={algo.name}
                    href={algo.href}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-sm">{algo.name}</p>
                      <p className="text-xs text-muted-foreground">{algo.category}</p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Info Card */}
            <div className="rounded-xl border border-border/50 bg-card p-5">
              <h3 className="font-semibold mb-4">How it works</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium">Select an algorithm</p>
                    <p className="text-xs text-muted-foreground">Choose from the sidebar or categories above</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium">Customize the input</p>
                    <p className="text-xs text-muted-foreground">Set your own array values or use defaults</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium">Watch & learn</p>
                    <p className="text-xs text-muted-foreground">Step through the visualization at your pace</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

"use client"

import * as React from "react"
import {
  Search,
  Binary,
  ArrowUpDown,
  GitBranch,
  TreeDeciduous,
  LayoutGrid,
  BookOpen,
  Github,
  ExternalLink,
  Home,
  Sparkles,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Searching",
      url: "#",
      icon: Search,
      items: [
        {
          title: "Linear Search",
          url: "/visualize/searching/linear-search",
        },
        {
          title: "Binary Search",
          url: "/visualize/searching/binary-search",
        },
        {
          title: "Jump Search",
          url: "/visualize/searching/jump-search",
          disabled: true,
        },
        {
          title: "Interpolation Search",
          url: "/visualize/searching/interpolation-search",
          disabled: true,
        },
      ],
    },
    {
      title: "Sorting",
      url: "#",
      icon: ArrowUpDown,
      items: [
        {
          title: "Bubble Sort",
          url: "/visualize/sorting/bubble-sort",
          disabled: true,
        },
        {
          title: "Selection Sort",
          url: "/visualize/sorting/selection-sort",
          disabled: true,
        },
        {
          title: "Insertion Sort",
          url: "/visualize/sorting/insertion-sort",
          disabled: true,
        },
        {
          title: "Merge Sort",
          url: "/visualize/sorting/merge-sort",
          disabled: true,
        },
        {
          title: "Quick Sort",
          url: "/visualize/sorting/quick-sort",
          disabled: true,
        },
        {
          title: "Heap Sort",
          url: "/visualize/sorting/heap-sort",
          disabled: true,
        },
      ],
    },
    {
      title: "Graph Algorithms",
      url: "#",
      icon: GitBranch,
      items: [
        {
          title: "Breadth-First Search",
          url: "/visualize/graph/bfs",
          disabled: true,
        },
        {
          title: "Depth-First Search",
          url: "/visualize/graph/dfs",
          disabled: true,
        },
        {
          title: "Dijkstra's Algorithm",
          url: "/visualize/graph/dijkstra",
          disabled: true,
        },
        {
          title: "A* Algorithm",
          url: "/visualize/graph/a-star",
          disabled: true,
        },
      ],
    },
    {
      title: "Trees",
      url: "#",
      icon: TreeDeciduous,
      items: [
        {
          title: "Binary Search Tree",
          url: "/visualize/tree/bst",
          disabled: true,
        },
        {
          title: "AVL Tree",
          url: "/visualize/tree/avl",
          disabled: true,
        },
        {
          title: "Tree Traversals",
          url: "/visualize/tree/traversals",
          disabled: true,
        },
      ],
    },
    {
      title: "Data Structures",
      url: "#",
      icon: LayoutGrid,
      items: [
        {
          title: "Array",
          url: "/visualize/ds/array",
          disabled: true,
        },
        {
          title: "Linked List",
          url: "/visualize/ds/linked-list",
          disabled: true,
        },
        {
          title: "Stack",
          url: "/visualize/ds/stack",
          disabled: true,
        },
        {
          title: "Queue",
          url: "/visualize/ds/queue",
          disabled: true,
        },
        {
          title: "Hash Table",
          url: "/visualize/ds/hash-table",
          disabled: true,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Documentation",
      url: "https://docs-opendsa.vercel.app",
      icon: BookOpen,
      external: true,
    },
    {
      title: "GitHub",
      url: "https://github.com/soloshun/opendsa",
      icon: Github,
      external: true,
    },
  ],
}

function SearchForm() {
  return (
    <SidebarGroup className="py-0">
      <SidebarGroupContent className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search algorithms..."
          className="h-9 w-full bg-muted/50 pl-9 text-sm placeholder:text-muted-foreground focus-visible:ring-primary"
        />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <Binary className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-base">
                    Open<span className="text-primary">DSA</span>
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Algorithm Visualizer
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* Search bar */}
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="sm">
              <a
                href="https://github.com/soloshun/opendsa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Sparkles className="size-4 text-primary" />
                <span className="flex-1">Star on GitHub</span>
                <ExternalLink className="size-3 opacity-50" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

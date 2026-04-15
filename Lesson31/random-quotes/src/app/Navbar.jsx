"use client"

import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";


const appRoutes = [
  {
    name: 'Home',
    url: '/'
  },
  {
    name: 'My Liked Quotes',
    url: '/user/quotes/liked'
  }
];

export function TopNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {appRoutes.map(({ name, url }) => (
          <NavigationMenuItem key={name}>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href={url}>{name}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
};

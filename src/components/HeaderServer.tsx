import { HeaderClient } from "./HeaderClient";
import { getFullNavigationMenu } from "@/lib/navigation";

export async function Header() {
  const menuItems = await getFullNavigationMenu();

  return <HeaderClient menuItems={menuItems} />;
}

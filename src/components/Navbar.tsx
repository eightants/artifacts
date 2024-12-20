import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/components/DropdownMenu";

export function Navbar({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <nav className="flex items-center justify-between p-4 px-4 w-full">
      <a href="/" className="uppercase cursor-pointer no-underline">
        Artifacts
      </a>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="uppercase cursor-pointer">ITEMS</div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60 lg:w-80 bg-primary text-secondaryText mt-2 mx-4">
          {items.map((item) => (
            <DropdownMenuItem
              className="uppercase cursor-pointer text-xl"
              onClick={() => {
                window.location.href = `${`/${item.value}`}`;
              }}
            >
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}

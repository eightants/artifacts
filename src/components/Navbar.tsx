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
    <nav className="flex items-center justify-between p-4 px-8 w-full">
      <a href="/" className="uppercase cursor-pointer">
        Artifacts
      </a>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="uppercase cursor-pointer">Projects</div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-primary text-secondaryText mt-2 mx-4">
          {items.map((item) => (
            <DropdownMenuItem
              className="uppercase cursor-pointer"
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

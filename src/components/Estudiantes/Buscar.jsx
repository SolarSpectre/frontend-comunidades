import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function UserSearch() {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input placeholder="Buscar estudiantes..." className="pl-8" />
    </div>
  )
}


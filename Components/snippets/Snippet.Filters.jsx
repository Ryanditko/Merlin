import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = ["all", "email", "forms", "social", "support", "sales", "personal", "other"];
const statuses = ["all", "active", "inactive"];

export default function SnippetFilters({ filters, onFiltersChange }) {
  const handleFilterChange = (type, value) => {
    onFiltersChange(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className="flex gap-4">
      <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
        <SelectTrigger className="w-40 border-gray-200">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat} className="capitalize">
              {cat === 'all' ? 'Todas as Categorias' : cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
        <SelectTrigger className="w-40 border-gray-200">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status} value={status} className="capitalize">
              {status === 'all' ? 'Todos os Status' : status === 'active' ? 'Ativo' : 'Inativo'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
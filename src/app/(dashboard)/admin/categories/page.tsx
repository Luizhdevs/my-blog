import { getAdminCategories } from "@/features/admin"
import { CategoriesManager }  from "@/components/admin/categories/CategoriesManager"

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Categorias</h1>
        <p className="text-sm text-muted-foreground">
          Crie e gerencie categorias para posts e ferramentas
        </p>
      </div>

      <CategoriesManager categories={categories} />
    </div>
  )
}

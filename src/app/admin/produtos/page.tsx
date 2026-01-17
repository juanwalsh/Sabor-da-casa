'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Star,
  Clock,
  Users,
  MoreVertical,
  X,
  ImageIcon,
  Eye,
  Save,
  Tag,
  Upload,
  Loader2,
} from 'lucide-react';
import { categories, formatPrice } from '@/data/mockData';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// Tags sugeridas baseadas nos produtos existentes
const suggestedTags = [
  'popular', 'tradicional', 'caipira', 'saudavel', 'favorito', 'cremoso',
  'caseiro', 'leve', 'mineiro', 'substancioso', 'economico', 'completo',
  'fitness', 'premium', 'especial', 'vegetariano'
];

// Produto vazio para novo produto
const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  description: '',
  price: 0,
  image: '',
  categoryId: 'cat-1',
  active: true,
  featured: false,
  preparationTime: undefined,
  serves: undefined,
  tags: [],
};

// Componente de Preview do Produto
function ProductPreview({ product }: { product: Omit<Product, 'id'> }) {
  const category = categories.find((c) => c.id === product.categoryId);

  return (
    <div className="sticky top-4">
      <div className="flex items-center gap-2 mb-3">
        <Eye className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Preview</span>
      </div>

      <Card className={`overflow-hidden ${!product.active ? 'opacity-60' : ''}`}>
        <div className="relative h-48 w-full">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name || 'Produto'}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600';
              }}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
            {product.featured && (
              <Badge className="bg-accent text-accent-foreground text-xs">
                <Star className="w-3 h-3 mr-1" />
                Destaque
              </Badge>
            )}
            {!product.active && (
              <Badge variant="destructive" className="text-xs">
                Inativo
              </Badge>
            )}
          </div>

          {/* Category */}
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="text-xs">
              {category?.name || 'Categoria'}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold mb-1 line-clamp-1">
            {product.name || 'Nome do Produto'}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description || 'Descricao do produto aparecera aqui...'}
          </p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold font-serif text-primary">
              {formatPrice(product.price || 0)}
            </span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {product.preparationTime && (
                <span className="flex items-center gap-0.5">
                  <Clock className="w-3 h-3" />
                  {product.preparationTime}m
                </span>
              )}
              {product.serves && (
                <span className="flex items-center gap-0.5">
                  <Users className="w-3 h-3" />
                  {product.serves}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de Formulario de Produto
function ProductForm({
  product,
  onChange,
  onSubmit,
  onCancel,
  isNew = false,
}: {
  product: Omit<Product, 'id'>;
  onChange: (product: Omit<Product, 'id'>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isNew?: boolean;
}) {
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onChange({ ...product, image: data.url });
        toast.success('Imagem enviada com sucesso!');
      } else {
        toast.error(data.error || 'Erro ao enviar imagem');
      }
    } catch {
      toast.error('Erro ao enviar imagem');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !product.tags?.includes(tagInput.trim().toLowerCase())) {
      onChange({
        ...product,
        tags: [...(product.tags || []), tagInput.trim().toLowerCase()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange({
      ...product,
      tags: product.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  const handleSuggestedTag = (tag: string) => {
    if (!product.tags?.includes(tag)) {
      onChange({
        ...product,
        tags: [...(product.tags || []), tag],
      });
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Formulario */}
      <div className="space-y-6">
        {/* Imagem */}
        <div className="space-y-3">
          <Label>Imagem do Produto *</Label>

          {/* Upload de arquivo */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label
                htmlFor="image-upload"
                className={`flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-dashed cursor-pointer transition-colors ${
                  isUploading
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'hover:bg-muted/50 hover:border-primary'
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Enviar imagem do computador
                  </>
                )}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>ou</span>
          </div>

          {/* URL manual */}
          <Input
            id="image"
            placeholder="Cole a URL da imagem aqui"
            value={product.image}
            onChange={(e) => onChange({ ...product, image: e.target.value })}
          />

          <p className="text-xs text-muted-foreground">
            Formatos aceitos: JPG, PNG, WebP, GIF (max 5MB)
          </p>
        </div>

        {/* Nome */}
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Produto *</Label>
          <Input
            id="name"
            placeholder="Ex: Escondidinho de Carne Seca"
            value={product.name}
            onChange={(e) => onChange({ ...product, name: e.target.value })}
          />
        </div>

        {/* Descricao */}
        <div className="space-y-2">
          <Label htmlFor="description">Descricao *</Label>
          <Textarea
            id="description"
            placeholder="Descreva o produto, ingredientes, modo de preparo..."
            value={product.description}
            onChange={(e) => onChange({ ...product, description: e.target.value })}
            rows={4}
          />
        </div>

        {/* Preco e Categoria */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Preco (R$) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={product.price || ''}
              onChange={(e) =>
                onChange({ ...product, price: parseFloat(e.target.value) || 0 })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select
              value={product.categoryId}
              onValueChange={(value) => onChange({ ...product, categoryId: value })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tempo e Porcoes */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="prepTime">Tempo de Preparo (min)</Label>
            <Input
              id="prepTime"
              type="number"
              min="1"
              placeholder="Ex: 25"
              value={product.preparationTime || ''}
              onChange={(e) =>
                onChange({
                  ...product,
                  preparationTime: parseInt(e.target.value) || undefined,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serves">Serve quantas pessoas</Label>
            <Input
              id="serves"
              type="number"
              min="1"
              placeholder="Ex: 2"
              value={product.serves || ''}
              onChange={(e) =>
                onChange({
                  ...product,
                  serves: parseInt(e.target.value) || undefined,
                })
              }
            />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Digite uma tag e pressione Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={handleAddTag}>
              <Tag className="w-4 h-4" />
            </Button>
          </div>

          {/* Tags atuais */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Tags sugeridas */}
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-2">Sugestoes:</p>
            <div className="flex flex-wrap gap-1">
              {suggestedTags
                .filter((tag) => !product.tags?.includes(tag))
                .slice(0, 8)
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSuggestedTag(tag)}
                  >
                    + {tag}
                  </Badge>
                ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Opcoes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="active">Produto Ativo</Label>
              <p className="text-xs text-muted-foreground">
                Produtos inativos nao aparecem no cardapio
              </p>
            </div>
            <Switch
              id="active"
              checked={product.active}
              onCheckedChange={(checked) => onChange({ ...product, active: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="featured">Destaque</Label>
              <p className="text-xs text-muted-foreground">
                Produtos em destaque aparecem na pagina inicial
              </p>
            </div>
            <Switch
              id="featured"
              checked={product.featured}
              onCheckedChange={(checked) => onChange({ ...product, featured: checked })}
            />
          </div>
        </div>

        {/* Botoes */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={onSubmit} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            {isNew ? 'Criar Produto' : 'Salvar'}
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className="hidden lg:block">
        <ProductPreview product={product} />
      </div>
    </div>
  );
}

export default function ProdutosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>(emptyProduct);
  const [isSaving, setIsSaving] = useState(false);

  const {
    products: productsList,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleActive,
    toggleFeatured,
  } = useProducts();

  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === 'all' || product.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [productsList, searchQuery, categoryFilter]);

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || '';
  };

  const handleToggleActive = async (productId: string) => {
    const success = await toggleActive(productId);
    if (success) {
      toast.success('Status atualizado!');
    } else {
      toast.error('Erro ao atualizar status');
    }
  };

  const handleToggleFeatured = async (productId: string) => {
    const success = await toggleFeatured(productId);
    if (success) {
      toast.success('Destaque atualizado!');
    } else {
      toast.error('Erro ao atualizar destaque');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const success = await deleteProduct(productId);
    if (success) {
      toast.success('Produto removido!');
    } else {
      toast.error('Erro ao remover produto');
    }
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;

    setIsSaving(true);
    const success = await updateProduct(editingProduct);
    setIsSaving(false);

    if (success) {
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      toast.success('Produto atualizado!');
    } else {
      toast.error('Erro ao atualizar produto');
    }
  };

  const handleCreateProduct = async () => {
    // Validacao
    if (!newProduct.name.trim()) {
      toast.error('Digite o nome do produto');
      return;
    }
    if (!newProduct.description.trim()) {
      toast.error('Digite a descricao do produto');
      return;
    }
    if (!newProduct.price || newProduct.price <= 0) {
      toast.error('Digite um preco valido');
      return;
    }
    if (!newProduct.image.trim()) {
      toast.error('Adicione uma imagem do produto');
      return;
    }

    setIsSaving(true);
    const product = await createProduct(newProduct);
    setIsSaving(false);

    if (product) {
      setIsNewProductOpen(false);
      setNewProduct(emptyProduct);
      toast.success('Produto criado com sucesso!');
    } else {
      toast.error('Erro ao criar produto');
    }
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-1">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="h-11 sm:h-12 rounded-lg sm:rounded-xl w-full sm:w-auto sm:self-start" onClick={() => setIsNewProductOpen(true)}>
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="text-sm">Novo Produto</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold font-serif">{productsList.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold font-serif text-secondary">
                {productsList.filter((p) => p.active).length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold font-serif text-accent">
                {productsList.filter((p) => p.featured).length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Destaque</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold font-serif">{categories.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Categorias</p>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card
                  className={`overflow-hidden ${
                    !product.active ? 'opacity-60' : ''
                  }`}
                >
                  <div className="relative h-28 sm:h-48 w-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-1 sm:top-2 left-1 sm:left-2 flex gap-0.5 sm:gap-1 flex-wrap">
                      {product.featured && (
                        <Badge className="bg-accent text-accent-foreground text-xs sm:text-xs px-1 sm:px-2 py-0 sm:py-0.5">
                          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                          <span className="hidden sm:inline">Destaque</span>
                        </Badge>
                      )}
                      {!product.active && (
                        <Badge variant="destructive" className="text-xs sm:text-xs px-1 sm:px-2 py-0 sm:py-0.5">
                          <span className="hidden sm:inline">Inativo</span>
                          <span className="sm:hidden">Off</span>
                        </Badge>
                      )}
                    </div>

                    {/* Actions Menu */}
                    <div className="absolute top-1 sm:top-2 right-1 sm:right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="w-11 h-11 lg:w-8 lg:h-8 rounded-full"
                          >
                            <MoreVertical className="w-4 h-4 sm:w-4 sm:h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEdit(product)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleActive(product.id)}
                          >
                            {product.active ? 'Desativar' : 'Ativar'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleFeatured(product.id)}
                          >
                            {product.featured
                              ? 'Remover Destaque'
                              : 'Adicionar Destaque'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Category */}
                    <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2">
                      <Badge variant="secondary" className="text-xs sm:text-xs px-1 sm:px-2 py-0 sm:py-0.5">
                        {getCategoryName(product.categoryId)}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-2 sm:p-4">
                    <h3 className="font-semibold mb-0.5 sm:mb-1 line-clamp-1 text-xs sm:text-base">{product.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-3 line-clamp-1 sm:line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-lg font-bold font-serif text-primary">
                        {formatPrice(product.price)}
                      </span>
                      <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                        {product.preparationTime && (
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {product.preparationTime}m
                          </span>
                        )}
                        {product.serves && (
                          <span className="flex items-center gap-0.5">
                            <Users className="w-3 h-3" />
                            {product.serves}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">Nenhum produto encontrado</h3>
              <p className="text-sm text-muted-foreground">
                Tente buscar por outro termo ou altere o filtro
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Product Sheet */}
      <Sheet open={isNewProductOpen} onOpenChange={setIsNewProductOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-4xl overflow-y-auto p-3 sm:p-6">
          <SheetHeader className="mb-4 sm:mb-6">
            <SheetTitle className="font-serif text-lg sm:text-2xl">Novo Produto</SheetTitle>
            <SheetDescription className="text-xs sm:text-sm">
              Preencha os dados do produto.
            </SheetDescription>
          </SheetHeader>

          <ProductForm
            product={newProduct}
            onChange={setNewProduct}
            onSubmit={handleCreateProduct}
            onCancel={() => {
              setIsNewProductOpen(false);
              setNewProduct(emptyProduct);
            }}
            isNew
          />
        </SheetContent>
      </Sheet>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto p-3 sm:p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg sm:text-2xl">Editar Produto</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Altere os dados do produto.
            </DialogDescription>
          </DialogHeader>

          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onChange={(updated) => setEditingProduct({ ...editingProduct, ...updated })}
              onSubmit={handleSaveProduct}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingProduct(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

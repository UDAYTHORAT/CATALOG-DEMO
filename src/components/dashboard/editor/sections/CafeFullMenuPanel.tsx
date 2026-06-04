import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Plus, Trash2,
  ChevronDown, ChevronUp,
  Sparkles, Star, Edit2, Check, RotateCcw,
} from 'lucide-react';
import { subtleInputClass } from '../ui';

interface MenuItem {
  id: string;
  name: string;
  priceLabel: string;
  description: string;
  popular?: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface MenuData {
  title?: string;
  subTitle?: string;
  categories: MenuCategory[];
}

const DEFAULT_ENGLISH_MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'cat-coffee',
    name: 'Coffee',
    items: [
      { id: 'm1', name: 'Espresso', priceLabel: '$3.50', description: 'Rich, full-bodied espresso with a creamy crema.' },
      { id: 'm2', name: 'Cappuccino', priceLabel: '$4.50', description: 'Espresso topped with deeply frothed milk.' },
      { id: 'm3', name: 'Flat White', priceLabel: '$4.75', description: 'Velvety steamed milk over a double shot.' },
      { id: 'm4', name: 'Iced Caramel Latte', priceLabel: '$5.50', description: 'Chilled espresso, milk, and house caramel.', popular: true },
    ],
  },
  {
    id: 'cat-sandwiches',
    name: 'Gourmet Sandwiches',
    items: [
      { id: 'm9', name: 'Caprese Panini', priceLabel: '$8.50', description: 'Fresh mozzarella, ripe tomatoes, basil pesto, and wild rocket on toasted sourdough.' },
      { id: 'm10', name: 'Pesto Chicken Sourdough', priceLabel: '$9.50', description: 'Tender grilled chicken, homemade basil pesto, melted provolone, and baby spinach.', popular: true },
      { id: 'm11', name: 'Truffle Mushroom Toastie', priceLabel: '$9.00', description: 'Sautéed wild mushrooms, white truffle oil, and aged gruyère on rustic sourdough.' },
    ],
  },
  {
    id: 'cat-pastries',
    name: 'Pastries & Bites',
    items: [
      { id: 'm5', name: 'Butter Croissant', priceLabel: '$4.00', description: 'Flaky, golden baked fresh every morning.' },
      { id: 'm6', name: 'Almond Tart', priceLabel: '$5.50', description: 'Sweet almond frangipane in a crisp pastry shell.', popular: true },
      { id: 'm7', name: 'Avocado Toast', priceLabel: '$9.00', description: 'Sourdough, smashed avocado, chili flakes.' },
      { id: 'm8', name: 'Truffle Fries', priceLabel: '$7.50', description: 'Crispy fries tossed in parmesan and truffle oil.' },
    ],
  },
];

export default React.memo(function CafeFullMenuPanel({
  data,
  onUpdate,
}: {
  data: MenuData;
  onUpdate: (updates: Partial<MenuData>) => void;
}) {
  const categories = data.categories || [];
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    categories.length > 0 ? categories[0].id : null
  );
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const handleUpdateSectionText = (key: 'title' | 'subTitle', value: string) => {
    onUpdate({ [key]: value });
  };

  const handleResetToDefault = () => {
    if (window.confirm("Are you sure you want to reset the menu to the default English menu? This will overwrite your current changes.")) {
      onUpdate({
        title: 'Our Signature',
        subTitle: 'Handpicked recommendations just for you.',
        categories: DEFAULT_ENGLISH_MENU_CATEGORIES
      });
      if (DEFAULT_ENGLISH_MENU_CATEGORIES.length > 0) {
        setExpandedCategoryId(DEFAULT_ENGLISH_MENU_CATEGORIES[0].id);
      }
    }
  };

  const handleAddCategory = () => {
    const newCategory: MenuCategory = {
      id: `cat-${Date.now()}`,
      name: 'New Category',
      items: [],
    };
    onUpdate({
      categories: [...categories, newCategory],
    });
    setExpandedCategoryId(newCategory.id);
    setEditingCategoryId(newCategory.id);
    setEditingCategoryName('New Category');
  };

  const handleRenameCategory = (catId: string) => {
    if (!editingCategoryName.trim()) return;
    onUpdate({
      categories: categories.map((cat) =>
        cat.id === catId ? { ...cat, name: editingCategoryName.trim() } : cat
      ),
    });
    setEditingCategoryId(null);
  };

  const handleRemoveCategory = (catId: string) => {
    onUpdate({
      categories: categories.filter((cat) => cat.id !== catId),
    });
    if (expandedCategoryId === catId) {
      setExpandedCategoryId(null);
    }
  };

  const handleAddItem = (catId: string) => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: 'New Menu Item',
      priceLabel: '$4.00',
      description: 'Describe the ingredients and preparation style.',
      popular: false,
    };
    onUpdate({
      categories: categories.map((cat) =>
        cat.id === catId ? { ...cat, items: [...cat.items, newItem] } : cat
      ),
    });
  };

  const handleUpdateItem = (catId: string, itemId: string, updates: Partial<MenuItem>) => {
    onUpdate({
      categories: categories.map((cat) => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          items: cat.items.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        };
      }),
    });
  };

  const handleRemoveItem = (catId: string, itemId: string) => {
    onUpdate({
      categories: categories.map((cat) => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          items: cat.items.filter((item) => item.id !== itemId),
        };
      }),
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3A2211] text-[#F4F0EB] shadow-lg shadow-[#3A2211]/20 shrink-0">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-slate-900">Full Menu</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {categories.length} Categor{categories.length === 1 ? 'y' : 'ies'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full">
          <button
            onClick={handleResetToDefault}
            className="flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-[10px] font-black uppercase tracking-[0.1em] transition-all bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 border border-slate-200"
            title="Reset to default English menu"
          >
            <RotateCcw size={12} className="shrink-0" />
            Reset Menu
          </button>
          <button
            id="tour-menu-add-category"
            onClick={handleAddCategory}
            className="flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-[10px] font-black uppercase tracking-[0.1em] transition-all bg-[#3A2211] text-[#F4F0EB] hover:bg-[#2a180b] shadow-lg shadow-[#3A2211]/20 active:scale-95"
          >
            <Plus size={12} className="shrink-0" />
            Add Category
          </button>
        </div>
      </div>

      {/* ── Section Text ── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden" id="tour-menu-section-text">
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Section Text</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-0.5">Kicker</span>
              <input
                id="tour-menu-kicker"
                value={data.title ?? 'Our Signature'}
                onChange={(e) => handleUpdateSectionText('title', e.target.value)}
                placeholder="e.g. Our Signature"
                className={subtleInputClass}
              />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-0.5">Main Heading</span>
              <input
                id="tour-menu-heading"
                value={data.subTitle ?? 'Handpicked recommendations just for you.'}
                onChange={(e) => handleUpdateSectionText('subTitle', e.target.value)}
                placeholder="e.g. Handpicked recommendations just for you."
                className={subtleInputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Categories List ── */}
      <div className="space-y-4" id="tour-menu-categories">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
          Menu Categories ({categories.length})
        </p>

        {categories.length === 0 ? (
          <div id="tour-menu-empty" className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-14 px-6 text-center">
            <BookOpen className="mb-4 text-slate-300" size={36} />
            <p className="text-sm font-black text-slate-500">No categories yet</p>
            <p className="mt-1 text-[11px] text-slate-400 max-w-[220px]">
              Add categories like Coffee or Pastries to organize your menu.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => {
              const isExpanded = expandedCategoryId === category.id;
              const isEditingName = editingCategoryId === category.id;

              return (
                <div
                  key={category.id}
                  className={`rounded-2xl border transition-all overflow-hidden bg-white ${
                    isExpanded
                      ? 'border-[#3A2211]/20 shadow-lg'
                      : 'border-slate-100 hover:border-slate-200 hover:shadow-sm'
                  }`}
                >
                  {/* Category Header Row */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer select-none"
                    onClick={() => {
                      if (!isEditingName) {
                        setExpandedCategoryId(isExpanded ? null : category.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {isEditingName ? (
                        <div className="flex items-center gap-2 w-full max-w-[250px]" onClick={(e) => e.stopPropagation()}>
                          <input
                            value={editingCategoryName}
                            onChange={(e) => setEditingCategoryName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRenameCategory(category.id);
                              if (e.key === 'Escape') setEditingCategoryId(null);
                            }}
                            className={`${subtleInputClass} h-8 py-1`}
                            autoFocus
                          />
                          <button
                            onClick={() => handleRenameCategory(category.id)}
                            className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
                          >
                            <Check size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm truncate">{category.name}</h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCategoryId(category.id);
                              setEditingCategoryName(category.name);
                            }}
                            className="p-1 text-slate-400 hover:text-[#3A2211] rounded-md transition-colors"
                          >
                            <Edit2 size={12} />
                          </button>
                        </div>
                      )}
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500 shrink-0">
                        {category.items.length} item{category.items.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleRemoveCategory(category.id)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        onClick={() => setExpandedCategoryId(isExpanded ? null : category.id)}
                        className={`h-8 w-8 flex items-center justify-center rounded-lg transition-colors ${
                          isExpanded ? 'bg-[#3A2211] text-white' : 'bg-slate-50 text-slate-400'
                        }`}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Category Items List */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="border-t border-slate-100 bg-slate-50/40 p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">
                              Items
                            </span>
                            <button
                              id="tour-menu-add-item"
                              onClick={() => handleAddItem(category.id)}
                              className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#3A2211] hover:text-[#2a180b] transition-colors"
                            >
                              <Plus size={12} />
                              Add Item
                            </button>
                          </div>

                          {category.items.length === 0 ? (
                            <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-white/50">
                              <p className="text-[11px] text-slate-400 font-medium">No items in this category yet.</p>
                              <button
                                onClick={() => handleAddItem(category.id)}
                                className="mt-2 text-[10px] font-bold text-[#3A2211] hover:underline"
                              >
                                Add your first item
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-3" id="tour-menu-items">
                              {category.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3 relative group"
                                >
                                  {/* Delete Button */}
                                  <button
                                    onClick={() => handleRemoveItem(category.id, item.id)}
                                    className="absolute right-3 top-3 h-7 w-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
                                  >
                                    <Trash2 size={13} />
                                  </button>
 
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="md:col-span-2">
                                      <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1 ml-0.5">
                                        Item Name
                                      </span>
                                      <input
                                        value={item.name}
                                        onChange={(e) =>
                                          handleUpdateItem(category.id, item.id, { name: e.target.value })
                                        }
                                        className={`${subtleInputClass} text-xs`}
                                        placeholder="e.g. Espresso"
                                      />
                                    </div>
                                    <div>
                                      <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1 ml-0.5">
                                        Price
                                      </span>
                                      <input
                                        value={item.priceLabel}
                                        onChange={(e) =>
                                          handleUpdateItem(category.id, item.id, { priceLabel: e.target.value })
                                        }
                                        className={`${subtleInputClass} text-xs`}
                                        placeholder="e.g. $3.50"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1 ml-0.5">
                                      Description
                                    </span>
                                    <textarea
                                      value={item.description}
                                      onChange={(e) =>
                                        handleUpdateItem(category.id, item.id, { description: e.target.value })
                                      }
                                      className={`${subtleInputClass} text-xs min-h-[60px] py-2 leading-relaxed resize-y`}
                                      placeholder="e.g. Rich, full-bodied espresso with a creamy crema."
                                    />
                                  </div>

                                  {/* Popular Tag Toggle */}
                                  <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center gap-2">
                                      <button
                                        id="tour-menu-popular-badge"
                                        type="button"
                                        onClick={() =>
                                          handleUpdateItem(category.id, item.id, { popular: !item.popular })
                                        }
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all ${
                                          item.popular
                                            ? 'bg-amber-50 border-amber-200 text-amber-600'
                                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                                        }`}
                                      >
                                        <Sparkles size={11} className={item.popular ? 'fill-amber-400' : ''} />
                                        Popular Badge
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

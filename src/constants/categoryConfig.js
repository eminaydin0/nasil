import { TreePine, Home, Dice6, Spade, Package, Brain, Gamepad2 } from 'lucide-react';

export const categoryConfig = {
  'Dış Mekan': { 
    icon: TreePine, 
    color: 'green', 
    bgColor: 'bg-green-50',
    image: 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?q=80&w=2070&auto=format&fit=crop'
  },
  'İç Mekan': { 
    icon: Home, 
    color: 'blue', 
    bgColor: 'bg-blue-50',
    image: 'https://images.unsplash.com/photo-1560420025-9a327c4418d4?q=80&w=1974&auto=format&fit=crop'
  },
  'Masa Oyunları': { 
    icon: Dice6, 
    color: 'purple', 
    bgColor: 'bg-purple-50',
    image: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?q=80&w=2000&auto=format&fit=crop'
  },
  'Kağıt Oyunları': { 
    icon: Spade, 
    color: 'red', 
    bgColor: 'bg-red-50',
    image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=2070&auto=format&fit=crop'
  },
  'Kutu Oyunları': { 
    icon: Package, 
    color: 'orange', 
    bgColor: 'bg-orange-50',
    image: 'https://images.unsplash.com/photo-1563906267088-b029e7101114?q=80&w=2070&auto=format&fit=crop'
  },
  'Zeka Oyunları': { 
    icon: Brain, 
    color: 'indigo', 
    bgColor: 'bg-indigo-50',
    image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=2070&auto=format&fit=crop'
  },
  'default': { 
    icon: Gamepad2, 
    color: 'gray', 
    bgColor: 'bg-gray-50',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop'
  }
};

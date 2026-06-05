import { Layout } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useHomeContentStore } from '@/stores/homeContentStore';
import { TEMPLATE_LABELS, TEMPLATE_DESCRIPTIONS, type TemplateType } from '@/types';

const TEMPLATE_ORDER: TemplateType[] = [
  'splitScreenHero',
  'singleColumnFocus',
  'zPattern',
  'fPattern',
  'invertedPyramid',
  'cardGrid',
  'alternating',
  'longFormSales',
  'storytellingScroll',
  'asymmetricalEditorial',
  'productShowcase',
  'leadCapture',
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TemplateLibrary({ open, onClose }: Props) {
  const addSection = useHomeContentStore((s) => s.addSection);

  const handleSelect = (type: TemplateType) => {
    addSection(type);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto bg-nahkya-surface border-nahkya-border">
        <DialogHeader>
          <DialogTitle className="font-display text-display-sm font-medium">
            Choose a Section Template
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          {TEMPLATE_ORDER.map((type) => (
            <button
              key={type}
              onClick={() => handleSelect(type)}
              className="group text-left p-5 bg-nahkya-bg rounded-nahkya border border-nahkya-border hover:border-nahkya-gold/50 hover:shadow-gold-focus transition-all"
            >
              <div className="w-10 h-10 rounded-nahkya bg-nahkya-gold/10 flex items-center justify-center text-nahkya-gold mb-4 group-hover:bg-nahkya-gold/20 transition-colors">
                <Layout size={18} />
              </div>
              <h3 className="font-display text-heading-md font-medium mb-1 group-hover:text-nahkya-gold transition-colors">
                {TEMPLATE_LABELS[type]}
              </h3>
              <p className="font-body text-body-sm text-nahkya-text-muted leading-relaxed">
                {TEMPLATE_DESCRIPTIONS[type]}
              </p>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

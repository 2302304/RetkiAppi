'use client';

import { useState } from 'react';
import { PackingTemplateType } from '@/types/planning';
import { PACKING_TEMPLATES } from '@/data/packing-templates';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Package, Tent, Snowflake, FileText } from 'lucide-react';

const templateIcons: Record<string, React.ElementType> = {
  paivaretki: Package,
  yopyminen: Tent,
  talviretki: Snowflake,
};

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (templateType: PackingTemplateType, name: string) => void;
  onCreateEmpty: (name: string) => void;
}

export function TemplateSelector({
  isOpen,
  onClose,
  onSelect,
  onCreateEmpty,
}: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PackingTemplateType | 'custom' | null>(null);
  const [name, setName] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    if (selectedTemplate === 'custom') {
      onCreateEmpty(name.trim());
    } else if (selectedTemplate) {
      onSelect(selectedTemplate, name.trim());
    }
    setName('');
    setSelectedTemplate(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Uusi pakkauslista">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Valitse pohja tai luo tyhjä lista.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {PACKING_TEMPLATES.map((template) => {
            const Icon = templateIcons[template.type] || FileText;
            const selected = selectedTemplate === template.type;
            return (
              <button
                key={template.type}
                type="button"
                onClick={() => {
                  setSelectedTemplate(template.type);
                  if (!name) setName(template.name);
                }}
                className={cn(
                  'p-3 rounded-lg border text-left transition-colors',
                  selected
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <Icon
                  size={24}
                  className={selected ? 'text-green-600' : 'text-gray-400'}
                />
                <p className="font-medium text-sm mt-2">{template.name}</p>
                <p className="text-xs text-gray-500">{template.items.length} tavaraa</p>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setSelectedTemplate('custom');
              if (!name) setName('Oma lista');
            }}
            className={cn(
              'p-3 rounded-lg border text-left transition-colors',
              selectedTemplate === 'custom'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <FileText
              size={24}
              className={selectedTemplate === 'custom' ? 'text-green-600' : 'text-gray-400'}
            />
            <p className="font-medium text-sm mt-2">Tyhjä lista</p>
            <p className="text-xs text-gray-500">Aloita alusta</p>
          </button>
        </div>

        {selectedTemplate && (
          <>
            <Input
              id="listName"
              label="Listan nimi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anna listalle nimi..."
              autoFocus
            />
            <div className="flex gap-3">
              <Button onClick={handleCreate} disabled={!name.trim()}>
                Luo lista
              </Button>
              <Button variant="secondary" onClick={onClose}>
                Peruuta
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

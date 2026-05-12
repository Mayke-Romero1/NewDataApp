import { User, Building2, Bell, Shield, Palette, CreditCard } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'workspace', label: 'Workspace', icon: Building2 },
  { id: 'notifications', label: 'Notificações', icon: Bell },
  { id: 'security', label: 'Segurança', icon: Shield },
  { id: 'appearance', label: 'Aparência', icon: Palette },
  { id: 'billing', label: 'Plano', icon: CreditCard },
]

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="flex h-full">
      {/* Tabs sidebar */}
      <aside className="w-52 border-r border-[var(--border)] py-4 px-3 flex flex-col gap-1 bg-[var(--bg-secondary)] flex-shrink-0">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-1 mb-2">
          Configurações
        </p>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn('sidebar-item w-full text-left text-sm', activeTab === id && 'active')}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 max-w-2xl">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-semibold text-base text-[var(--text-primary)] mb-1">Perfil</h2>
              <p className="text-sm text-[var(--text-muted)]">Informações da sua conta</p>
            </div>
            <div className="card space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-700 flex items-center justify-center font-display font-bold text-xl text-white">
                  U
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Seu avatar</p>
                  <button className="btn-secondary text-xs h-7 py-0 mt-1">Alterar foto</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[var(--text-muted)] block mb-1.5">Nome</label>
                  <input className="input text-sm" defaultValue="Usuário" />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)] block mb-1.5">Sobrenome</label>
                  <input className="input text-sm" defaultValue="Workspace" />
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--text-muted)] block mb-1.5">Email</label>
                <input className="input text-sm" defaultValue="usuario@empresa.com" type="email" />
              </div>
              <button className="btn-primary text-sm">Salvar alterações</button>
            </div>
          </div>
        )}

        {activeTab === 'workspace' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-semibold text-base text-[var(--text-primary)] mb-1">Workspace</h2>
              <p className="text-sm text-[var(--text-muted)]">Configurações do seu workspace</p>
            </div>
            <div className="card space-y-4">
              <div>
                <label className="text-xs text-[var(--text-muted)] block mb-1.5">Nome do workspace</label>
                <input className="input text-sm" defaultValue="Minha Empresa" />
              </div>
              <div>
                <label className="text-xs text-[var(--text-muted)] block mb-1.5">Slug (URL)</label>
                <input className="input text-sm" defaultValue="minha-empresa" />
              </div>
              <div>
                <label className="text-xs text-[var(--text-muted)] block mb-1.5">Fuso horário</label>
                <select className="input text-sm">
                  <option>America/Sao_Paulo (GMT-3)</option>
                  <option>America/New_York (GMT-5)</option>
                  <option>Europe/London (GMT+0)</option>
                </select>
              </div>
              <button className="btn-primary text-sm">Salvar workspace</button>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-semibold text-base text-[var(--text-primary)] mb-1">Plano & Cobrança</h2>
              <p className="text-sm text-[var(--text-muted)]">Gerencie seu plano e uso</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Free', price: 'R$ 0', features: ['3 dashboards', '2 apresentações', '2 integrações'], current: false },
                { name: 'Pro', price: 'R$ 97/mês', features: ['Dashboards ilimitados', 'Slides ilimitados', 'Todas as integrações', 'Export PDF/PPTX'], current: true },
                { name: 'Business', price: 'R$ 297/mês', features: ['Tudo do Pro', 'Multi-workspace', 'Relatórios agendados', 'Suporte prioritário'], current: false },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={cn(
                    'card',
                    plan.current && 'border-brand-500/50 bg-brand-950/30'
                  )}
                >
                  {plan.current && (
                    <span className="badge badge-brand text-xs mb-2">Plano atual</span>
                  )}
                  <p className="font-display font-semibold text-[var(--text-primary)]">{plan.name}</p>
                  <p className="text-lg font-bold text-[var(--text-primary)] my-1">{plan.price}</p>
                  <ul className="space-y-1 mt-3 mb-4">
                    {plan.features.map((f) => (
                      <li key={f} className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-brand-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {!plan.current && (
                    <button className="btn-secondary text-xs w-full justify-center">
                      {plan.name === 'Business' ? 'Falar com vendas' : 'Fazer upgrade'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {['notifications', 'security', 'appearance'].includes(activeTab) && (
          <div className="card flex flex-col items-center justify-center py-12 text-center gap-2">
            <p className="text-[var(--text-muted)] text-sm">
              Esta seção será implementada em breve.
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Use o Lovable para expandir estas configurações.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

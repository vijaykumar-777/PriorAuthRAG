export interface ToastMessage {
  id: string;
  message: string;
  icon?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export type ViewType =
  | 'prior-auth-dashboard'
  | 'clinical-guidelines-rag'
  | 'coverage-rules'
  | 'medical-policies'
  | 'toc-index'
  | 'audit-trail';

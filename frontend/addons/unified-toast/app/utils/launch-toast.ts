

type IToast = Parameters<ReturnType<typeof useToast>['add']>['0'];
type ITypedToast = Omit<IToast, 'icon' | 'color'>;


export function toast(options: IToast) {
  useToast().add(options);
}


export function toastSuccess(options: ITypedToast) {
  toast({
    icon: 'i-lucide-check',
    color: 'success',
    ...options,
  });
}

export function toastError(options: ITypedToast) {
  toast({
    icon: 'i-lucide-circle-alert',
    color: 'error',
    ...options,
  });
}

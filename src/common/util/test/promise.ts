export const promise: (arg?: any) => { promise: () => Promise<any> } = (arg?: any) => ({
  promise: async () => arg
})

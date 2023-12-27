// quill.d.ts
declare module '@vueup/vue-quill' {
    import type { App, Ref } from 'vue';
  
    export const useQuill: () => {
      quill: Ref<Quill | null>;
      editorOptions: Ref<QuillOptionsStatic>;
    };
  
    export const quillEditor: (app: App, options?: QuillOptionsStatic) => void;
  
    export interface Quill {
      // Add Quill instance type definitions here
      // For example:
      getText: () => string;
      // ...
    }
  
    export interface QuillOptionsStatic {
      // Add Quill options type definitions here
      // For example:
      theme?: string;
      // ...
    }
  }
declare module 'quill';
  
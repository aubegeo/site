export {}

declare module '#app' {
  interface NuxtApp {
    $db: ReturnType<typeof import('firebase/firestore').getFirestore>
  }
}

import '@shxnovel/world';

declare module "@shxnovel/world" {
  namespace Assets {

    namespace Texture {
      interface Key {
        'a.jpg': never;
      }
    }

    namespace Audio {
      interface Key { }
    }

  }
}

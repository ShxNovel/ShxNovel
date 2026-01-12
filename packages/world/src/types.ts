export declare namespace Assets {
    namespace Texture {
        interface Key {}
    }

    namespace Audio {
        interface Key {}
    }
}

export type TextureKey = keyof Assets.Texture.Key;
export type AudioKey = keyof Assets.Audio.Key;





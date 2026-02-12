import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

export async function uriToPath(uri: string): Promise<Uint8Array> {
    try {
        const manipulatedImage = await manipulateAsync(
        uri,
        [{ resize: { width: 500 } }],
        {
          compress: 0.7,
          format: SaveFormat.JPEG,
          base64: true,
        }
    );

    if (!manipulatedImage.base64) {
        throw new Error('No base64 produced from manipulator')
    }

    const base64 = manipulatedImage.base64;
    const byteString = atob(base64);
    const arrayBuffer = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        arrayBuffer[i] = byteString.charCodeAt(i);
    }

    return arrayBuffer
    } catch (error) {
        console.error(error)
    }
}
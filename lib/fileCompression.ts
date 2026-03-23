// File compression utilities before uploading to Cloudinary

interface CompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    maxSizeMB?: number;
}

export async function compressImage(file: File, options: CompressionOptions = {}): Promise<File> {
    const {
        maxWidth = 1920,
        maxHeight = 1080,
        quality = 0.8,
        maxSizeMB = 10
    } = options;

    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img;
            
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width *= ratio;
                height *= ratio;
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        resolve(file);
                        return;
                    }

                    // Check if still too large, reduce quality
                    if (blob.size > maxSizeMB * 1024 * 1024) {
                        compressWithQuality(ctx, canvas, file, width, height, maxSizeMB, resolve);
                    } else {
                        const compressedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        });
                        resolve(compressedFile);
                    }
                },
                file.type,
                quality
            );
        };

        img.src = URL.createObjectURL(file);
    });
}

function compressWithQuality(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    originalFile: File,
    width: number,
    height: number,
    maxSizeMB: number,
    resolve: (file: File) => void
) {
    let quality = 0.8;
    const minQuality = 0.1;
    const step = 0.1;

    const tryCompress = () => {
        canvas.toBlob(
            (blob) => {
                if (!blob || quality <= minQuality) {
                    // If we can't compress enough, return the best we have
                    if (blob) {
                        resolve(new File([blob], 'compressed.jpg', {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        }));
                    } else {
                        resolve(originalFile);
                    }
                    return;
                }

                if (blob.size <= maxSizeMB * 1024 * 1024) {
                    const compressedFile = new File([blob], 'compressed.jpg', {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    resolve(compressedFile);
                } else {
                    quality -= step;
                    tryCompress();
                }
            },
            'image/jpeg',
            quality
        );
    };

    tryCompress();
}

export async function compressVideo(file: File, options: CompressionOptions = {}): Promise<File> {
    const { maxSizeMB = 10 } = options;

    // For videos, we can't easily compress in the browser without external libraries
    // For now, we'll check the size and return an error if too large
    // In a production environment, you might want to use a service like Cloudinary's
    // built-in compression or a client-side library like ffmpeg.wasm
    
    if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`Video file size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${maxSizeMB}MB. Please compress the video before uploading.`);
    }

    return file;
}

export async function compressFile(file: File, options: CompressionOptions = {}): Promise<File> {
    // Check if file needs compression
    const maxSizeMB = options.maxSizeMB || 10;
    
    if (file.size <= maxSizeMB * 1024 * 1024) {
        return file; // No compression needed
    }

    // Handle different file types
    if (file.type.startsWith('image/')) {
        return compressImage(file, options);
    } else if (file.type.startsWith('video/')) {
        return compressVideo(file, options);
    }

    // For other file types, return as is
    return file;
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

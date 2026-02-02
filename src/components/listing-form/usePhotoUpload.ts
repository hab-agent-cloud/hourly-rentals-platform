import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

export function usePhotoUpload(
  token: string,
  formData: any,
  setFormData: (data: any) => void,
  newRoom: any,
  setNewRoom: (room: any) => void
) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingRoomPhotos, setUploadingRoomPhotos] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isRoomPhoto = false, roomIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const reader = new FileReader();
      const uploadPromise = new Promise<string>((resolve, reject) => {
        reader.onload = async (event) => {
          try {
            const base64 = event.target?.result?.toString().split(',')[1];
            if (!base64) {
              reject('Ошибка чтения файла');
              return;
            }

            const result = await api.uploadPhoto(token, base64, file.type);
            
            if (result.url) {
              resolve(result.url);
            } else {
              reject('Не удалось получить URL фото');
            }
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = () => reject('Ошибка чтения файла');
      });
      
      reader.readAsDataURL(file);
      const url = await uploadPromise;
      
      if (isRoomPhoto && roomIndex !== undefined) {
        const updatedRooms = [...formData.rooms];
        updatedRooms[roomIndex].image_url = url;
        setFormData({ ...formData, rooms: updatedRooms });
      } else {
        setFormData({ ...formData, image_url: url });
      }
      
      toast({
        title: 'Успешно',
        description: 'Фото загружено',
      });
    } catch (error: any) {
      console.error('Photo upload error:', error);
      toast({
        title: 'Ошибка',
        description: error?.message || 'Не удалось загрузить фото',
        variant: 'destructive',
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const reader = new FileReader();
      const uploadPromise = new Promise<string>((resolve, reject) => {
        reader.onload = async (event) => {
          try {
            const base64 = event.target?.result?.toString().split(',')[1];
            if (!base64) {
              reject('Ошибка чтения файла');
              return;
            }

            const result = await api.uploadPhoto(token, base64, file.type);
            
            if (result.url) {
              resolve(result.url);
            } else {
              reject('Не удалось получить URL логотипа');
            }
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = () => reject('Ошибка чтения файла');
      });
      
      reader.readAsDataURL(file);
      const url = await uploadPromise;
      
      setFormData({ ...formData, logo_url: url });
      toast({
        title: 'Успешно',
        description: 'Логотип загружен',
      });
    } catch (error: any) {
      console.error('Logo upload error:', error);
      toast({
        title: 'Ошибка',
        description: error?.message || 'Не удалось загрузить логотип',
        variant: 'destructive',
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const compressImage = (file: File, maxWidth = 800, quality = 0.6): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          let currentQuality = quality;
          const tryCompress = () => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject('Ошибка сжатия');
                  return;
                }
                
                const estimatedBase64Size = (blob.size * 4) / 3;
                console.log(`Compressed size: ${blob.size} bytes (base64: ~${Math.round(estimatedBase64Size / 1024)}KB), quality: ${currentQuality}`);
                
                if (estimatedBase64Size > 2 * 1024 * 1024 && currentQuality > 0.3) {
                  currentQuality -= 0.1;
                  console.log(`Too large, retrying with quality ${currentQuality}`);
                  tryCompress();
                  return;
                }
                
                const reader2 = new FileReader();
                reader2.onload = () => {
                  const base64 = reader2.result?.toString().split(',')[1];
                  if (base64) {
                    console.log(`Final base64 size: ${Math.round(base64.length / 1024)}KB`);
                    resolve(base64);
                  } else {
                    reject('Ошибка чтения');
                  }
                };
                reader2.onerror = reject;
                reader2.readAsDataURL(blob);
              },
              'image/jpeg',
              currentQuality
            );
          };
          
          tryCompress();
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadRoomPhotosFiles = async (files: File[]) => {
    console.log('=== UPLOAD ROOM PHOTOS START ===');
    console.log('Files count:', files.length);
    
    if (files.length === 0) {
      console.log('No files selected');
      return;
    }
    
    const currentImages = Array.isArray(newRoom.images) ? newRoom.images : [];
    console.log('Current room images:', currentImages.length);
    
    if (currentImages.length + files.length > 10) {
      console.log('Too many photos:', currentImages.length + files.length);
      toast({
        title: 'Ошибка',
        description: 'Максимум 10 фото на номер',
        variant: 'destructive',
      });
      return;
    }

    setUploadingRoomPhotos(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        console.log('Processing file:', file.name, file.type, file.size);
        
        console.log('Compressing image...');
        const base64 = await compressImage(file);
        console.log('Compressed base64 length:', base64.length);

        try {
          console.log('Calling api.uploadPhoto...');
          const uploadResult = await api.uploadPhoto(token, base64, 'image/jpeg');
          console.log('Upload result:', uploadResult);
          
          if (uploadResult.url) {
            console.log('Photo uploaded successfully:', uploadResult.url);
            uploadedUrls.push(uploadResult.url);
          } else {
            console.error('No URL in upload result:', uploadResult);
            throw new Error('Не удалось загрузить');
          }
        } catch (err) {
          console.error('Upload API error:', err);
          throw err;
        }
      }

      console.log('All photos uploaded:', uploadedUrls);
      setNewRoom({ ...newRoom, images: [...currentImages, ...uploadedUrls] });
      toast({
        title: 'Успешно',
        description: `Загружено ${uploadedUrls.length} фото`,
      });
    } catch (error: any) {
      console.error('=== UPLOAD ROOM PHOTOS ERROR ===');
      console.error('Error:', error);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      toast({
        title: 'Ошибка',
        description: error?.message || 'Не удалось загрузить фото',
        variant: 'destructive',
      });
    } finally {
      setUploadingRoomPhotos(false);
      console.log('=== UPLOAD ROOM PHOTOS END ===');
    }
  };

  const handleNewRoomPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await uploadRoomPhotosFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      await uploadRoomPhotosFiles(files);
    }
  };

  const removeNewRoomPhoto = (index: number) => {
    const currentImages = Array.isArray(newRoom.images) ? newRoom.images : [];
    setNewRoom({
      ...newRoom,
      images: currentImages.filter((_, i) => i !== index),
    });
    toast({
      title: 'Фото удалено',
      description: `Осталось ${currentImages.length - 1} фото`,
    });
  };

  const replaceRoomPhoto = async (index: number, file: File) => {
    setUploadingRoomPhotos(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result?.toString().split(',')[1];
        if (!base64) return;

        const result = await api.uploadPhoto(token, base64, file.type);
        
        if (result.url) {
          const currentImages = Array.isArray(newRoom.images) ? newRoom.images : [];
          const updatedImages = [...currentImages];
          updatedImages[index] = result.url;
          setNewRoom({
            ...newRoom,
            images: updatedImages,
          });
          toast({
            title: 'Успешно',
            description: 'Фото заменено',
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('Photo replacement error:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось заменить фото',
        variant: 'destructive',
      });
    } finally {
      setUploadingRoomPhotos(false);
    }
  };

  return {
    fileInputRef,
    logoInputRef,
    uploadingPhoto,
    uploadingLogo,
    uploadingRoomPhotos,
    isDragging,
    handlePhotoUpload,
    handleLogoUpload,
    handleNewRoomPhotosUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeNewRoomPhoto,
    replaceRoomPhoto,
  };
}

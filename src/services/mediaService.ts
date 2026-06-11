import { storage } from '@/firebase/config';
import * as ImagePicker from 'expo-image-picker';

export async function pickImage(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) return null;
  return result.assets[0].uri;
}

export async function pickMultipleImages(): Promise<string[]> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    selectionLimit: 10,
    quality: 0.8,
  });

  if (result.canceled) return [];
  return result.assets.map((a) => a.uri);
}

export async function pickVideo(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['videos'],
    allowsEditing: true,
    quality: 0.8,
    videoMaxDuration: 60,
  });

  if (result.canceled || !result.assets[0]) return null;
  return result.assets[0].uri;
}

export async function uploadMedia(
  uri: string,
  path: string,
): Promise<string> {
  const ref = storage().ref(path);
  await ref.putFile(uri);
  return ref.getDownloadURL();
}

export async function uploadPostImages(
  userId: string,
  uris: string[],
): Promise<string[]> {
  const timestamp = Date.now();
  return Promise.all(
    uris.map((uri, i) =>
      uploadMedia(uri, `posts/${userId}/${timestamp}_${i}.jpg`),
    ),
  );
}

export async function uploadPostVideo(
  userId: string,
  uri: string,
): Promise<string> {
  const timestamp = Date.now();
  return uploadMedia(uri, `posts/${userId}/${timestamp}.mp4`);
}

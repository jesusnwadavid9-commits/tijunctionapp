import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { createPost } from '@/services/postService';
import { pickImage, pickMultipleImages, pickVideo, uploadPostImages, uploadPostVideo } from '@/services/mediaService';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants';
import type { PostType, User } from '@/types';

interface CreatePostFormProps {
  onSuccess?: () => void;
}

export function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');

      let type: PostType = 'text';
      let imageUrls: string[] = [];
      let videoUrl = '';

      if (selectedVideo) {
        type = 'video';
        videoUrl = await uploadPostVideo(user.id, selectedVideo);
      } else if (selectedImages.length > 1) {
        type = 'multi-image';
        imageUrls = await uploadPostImages(user.id, selectedImages);
      } else if (selectedImages.length === 1) {
        type = 'image';
        imageUrls = await uploadPostImages(user.id, selectedImages);
      }

      return createPost(
        { type, content, imageUrls, videoUrl },
        user,
      );
    },
    onSuccess: () => {
      setContent('');
      setSelectedImages([]);
      setSelectedVideo(null);
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message);
    },
  });

  const handlePickImage = useCallback(async () => {
    const uri = await pickImage();
    if (uri) {
      setSelectedVideo(null);
      setSelectedImages((prev) => [...prev, uri]);
    }
  }, []);

  const handlePickMultiple = useCallback(async () => {
    const uris = await pickMultipleImages();
    if (uris.length > 0) {
      setSelectedVideo(null);
      setSelectedImages(uris);
    }
  }, []);

  const handlePickVideo = useCallback(async () => {
    const uri = await pickVideo();
    if (uri) {
      setSelectedImages([]);
      setSelectedVideo(uri);
    }
  }, []);

  const canPost = content.trim().length > 0 || selectedImages.length > 0 || selectedVideo;

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Avatar uri={user?.profilePhotoUrl} name={user?.displayName} size={36} />
        <TextInput
          style={styles.input}
          placeholder="What's happening?"
          placeholderTextColor={COLORS.textLight}
          multiline
          maxLength={5000}
          value={content}
          onChangeText={setContent}
        />
      </View>

      {selectedImages.length > 0 && (
        <ScrollView horizontal style={styles.mediaPreview}>
          {selectedImages.map((uri, i) => (
            <View key={uri} style={styles.previewItem}>
              <Image source={{ uri }} style={styles.previewImage} contentFit="cover" />
              <TouchableOpacity
                style={styles.removeMedia}
                onPress={() => setSelectedImages((prev) => prev.filter((_, idx) => idx !== i))}
              >
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.toolbar}>
        <View style={styles.mediaButtons}>
          <TouchableOpacity onPress={handlePickImage} style={styles.mediaButton}>
            <Text style={styles.mediaIcon}>🖼</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickMultiple} style={styles.mediaButton}>
            <Text style={styles.mediaIcon}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickVideo} style={styles.mediaButton}>
            <Text style={styles.mediaIcon}>🎥</Text>
          </TouchableOpacity>
        </View>
        <Button
          title="Post"
          onPress={() => mutation.mutate()}
          disabled={!canPost}
          loading={mutation.isPending}
          size="sm"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  mediaPreview: {
    marginTop: SPACING.sm,
  },
  previewItem: {
    marginRight: SPACING.sm,
    position: 'relative',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
  },
  removeMedia: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  mediaButtons: {
    flexDirection: 'row',
  },
  mediaButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  mediaIcon: {
    fontSize: 20,
  },
});
